<?php

namespace App\Http\Controllers;

use App\Models\Catalog\Product;
use App\Models\Core\Shop;
use App\Models\Inventory\Alert;
use App\Models\Sales\Sale;
use App\Models\Sales\SaleItem;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ShopController extends Controller
{
    //
     // index - open shop
   public function overviewDashboard(Shop $shop)
   {

        $today = today();

        $totalSalesToday = Sale::where('shop_id', $shop->id)
            ->whereDate('created_at', $today)
            ->where('status', 'completed')
            ->count();
 
        $totalRevenueToday = Sale::where('shop_id', $shop->id)
            ->whereDate('created_at', $today)
            ->where('status', 'completed')
            ->sum('total_amount');
 
        // ── Alert stats ───────────────────────────────────────────────────────
 
        $lowStockCount = Alert::where('shop_id', $shop->id)
            ->where('type', 'low_stock')
            ->where('status', 'unread')
            ->count();
 
        $expiringSoonCount = Alert::where('shop_id', $shop->id)
            ->where('type', 'expiry')
            ->where('status', 'unread')
            ->count();
 
        // ── Recent sales ──────────────────────────────────────────────────────
 
        $recentSales = Sale::where('shop_id', $shop->id)
            ->whereDate('created_at', $today)
            ->where('status', 'completed')
            ->with(['user:id,name', 'items:id,sale_id'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($sale) => [
                'id'             => $sale->id,
                'receipt_number' => $sale->receipt_number,
                'cashier_name'   => $sale->user->name,
                'items_count'    => $sale->items->count(),
                'total_amount'   => number_format($sale->total_amount, 2),
                'payment_method' => $sale->payment_method,
                'time'           => $sale->created_at->format('h:i A'),
            ]);
 
        // ── Top selling products ──────────────────────────────────────────────

        $topProducts = SaleItem::query()
            ->whereHas('sale', function ($query) use ($shop, $today) {
                $query->where('shop_id', $shop->id)
                    ->whereDate('created_at', $today)
                    ->where('status', 'completed');
            })
            ->with(['product.dosageForm', 'product.packageUnit'])
            ->get() // Fetch records safely using framework drivers
            ->groupBy('product_id')
            ->map(function ($items) {
                $firstItem = $items->first();
                
                return [
                    'id'         => $firstItem->product_id,
                    'name'       => $firstItem->product?->name,
                    'form'       => $firstItem->product?->dosageForm?->name ?? 'N/A',
                    'unit'       => $firstItem->product?->packageUnit?->name ?? 'N/A',
                    'units_sold' => (int) $items->sum('quantity'),   // Pure collection math
                    'revenue'    => (float) $items->sum('subtotal'), // Pure collection math
                ];
            })
            ->sortByDesc('units_sold')
            ->take(5)
            ->values()
            ->map(fn($product) => [
                'id'         => $product['id'],
                'name'       => $product['name'],
                'form'       => $product['form'],
                'units_sold' => $product['units_sold'],
                'revenue'    => number_format($product['revenue'], 2),
            ]);
 
        // ── Render ────────────────────────────────────────────────────────────
 
        return Inertia::render('shop/overview/overview-dashboard', [
            'shop' => [
                'id'              => $shop->uuid,
                'name'            => $shop->name,
                'currency_symbol' => $shop->currency_symbol,
            ],
            'stats' => [
                'total_sales_today'   => $totalSalesToday,
                'total_revenue_today' => number_format($totalRevenueToday, 2),
                'low_stock_count'     => $lowStockCount,
                'expiring_soon_count' => $expiringSoonCount,
            ],
            'recent_sales' => $recentSales,
            'top_products' => $topProducts,
        ]);
   } 


   //SALES
   public function newSalePos(Shop $shop)
   {
     return Inertia::render("shop/sales/new-sale-pos"); 
   }

   public function salesHistory(Shop $shop)
   {
     return Inertia::render("shop/sales/sales-history"); 
   }

    //    PURCHASES
    public function receiveStock(Request $request, Shop $shop)
    {
        $search_input = $request->input('search'); 
        $search = strtolower($search_input);
        $products = [];
        if (!empty($search)) {
            $products = Product::where('shop_id', $shop->id)
                ->where('name', 'LIKE', "%{$search}%")
                ->with(['dosageForm:id,uuid,name', 'packageUnit:id,uuid,name'])
                ->limit(20)
                ->get()
                ->map(function ($product) {
                    return [
                        'uuid'         => $product->uuid,
                        'name'         => $product->name,
                        'sku'          => $product->sku,
                        'dosage_form'  => [
                            'uuid' => $product->dosageForm?->uuid ?? null,
                            'name' => $product->dosageForm?->name ?? 'N/A',
                        ], 
                        'package_unit' => [
                            'uuid' => $product->packageUnit?->uuid ?? null,
                            'name' => $product->packageUnit?->name ?? 'N/A',
                        ],
                ];
            });
        }
        $package_units = $shop->packageUnits()->get(['uuid', 'name']);
        $dosage_forms = $shop->dosageForms()->get(['uuid', 'name']);

        return Inertia::render("shop/purchases/receive-stock", [
            'products' => $products,
            'package_units' => $package_units,
            'dosage_forms' => $dosage_forms,
            'filters'  => $request->only(['search']),
            'shop_uuid' => $shop->uuid, 
            'search_input' => $search_input
        ]);
    }   
    
    public function purchasesHistory(Shop $shop)
    {
      return Inertia::render("shop/purchases/purchases-history"); 
    }

    public function createPackageUnit(Request $request, Shop $shop )
    {
        $request->merge([
            'name' => strtolower($request->input('name')),
        ]);

        $validated = $request->validate([   
            'name' => [
                'required',
                'string',
                'max:255',
                // Checks the 'units' table, ensuring 'name' is unique where 'shop_id' matches the current shop
                Rule::unique('package_units')->where(function ($query) use ($shop) {
                    return $query->where('shop_id', $shop->id);
                }),
            ],
        ]); 


        try{
            DB::beginTransaction();
            $shop->packageUnits()->create([
                'name' => $validated['name'],
            ]);
            DB::commit();
        }catch(Exception $e){
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to create unit: ']);
        }
    }

    public function createDosageForm(Request $request, Shop $shop)
    {

        $request->merge([
           'name' => strtolower($request->input('name')),
        ]);

        $validated = $request->validate([   
            'name' => [
                'required',
                'string',
                'max:255',
                // Checks the 'dosage_forms' table, ensuring 'name' is unique where 'shop_id' matches the current shop
                Rule::unique('dosage_forms')->where(function ($query) use ($shop) {
                    return $query->where('shop_id', $shop->id);
                }),
            ],
        ]); 


        try{
            DB::beginTransaction();
            $shop->dosageForms()->create([
                'name' => $validated['name'],
            ]);
            DB::commit();
        }catch(Exception $e){
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to create dosage form: ']);
        }
    }


    public function createProduct(Request $request, Shop $shop)
    {

        $request->merge([
            'name' => strtolower($request->input('name')), 
            'sku' => strtolower($request->input('sku')),
        ]);


       $validated  = $request->validate([
            'name' => 'required|string|max:255',
            'dosage_form_uuid' => [
                'required',
                'exists:dosage_forms,uuid', // Ensure the form exists in the dosage_forms table
            ],
            'package_unit_uuid' => [
                'required',
                'exists:package_units,uuid', // Ensure the unit exists in the units table
            ],
            'sku' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products')->where(function ($query) use ($shop) {
                    return $query->where('shop_id', $shop->id);
                }),
            ],
        ]);


        try {
            DB::beginTransaction();

            // Fetch the unit by UUID
            $dosage_form = $shop->dosageForms()->where('uuid', $validated['dosage_form_uuid'])->firstOrFail();
            $package_unit = $shop->packageUnits()->where('uuid', $validated['package_unit_uuid'])->firstOrFail();

            // Create the product with the associated unit_id
            $shop->products()->create([
                'name' => $validated['name'],
                'dosage_form_id' => $dosage_form->id, 
                'package_unit_id' => $package_unit->id,
                'sku' => $validated['sku'],
            ]);

            DB::commit();
            
        } catch (Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to create product: ']);
        }

        
    }

    public function createBatch(Request $request, Shop $shop)
    {
        $validated = $request->validate([
            'product_name'       => ['required', 'string', 'max:255'],
            'product_uuid'       => ['required', 'uuid', Rule::exists('products', 'uuid')->where('shop_id', $shop->id)],
            'batch_number'       => ['required', 'string', 'max:100'],
            'quantity_received'  => ['required', 'integer', 'min:1'],
            'cost_price'         => ['required', 'numeric', 'min:0'],
            'selling_price'      => ['required', 'numeric', 'min:0', 'gte:cost_price'], // must be >= cost price
            'manufactured_date'  => ['required', 'date', 'before_or_equal:today'],
            'expiry_date'        => ['required', 'date', 'after:today'],
        ]);          
    }   


    // CATALOG & INVENTORY
    public function productsCatalog(Request $request, Shop $shop)
    {
    
        return Inertia::render('shop/catalog/products'); 
        
    }

    public function batchesCatalog(Request $request, Shop $shop)
    {   
        return Inertia::render('shop/catalog/batches'); 
          
    }

    public function dosageFormsCatalog(Request $request, Shop $shop)
    {   
        return Inertia::render('shop/catalog/dosage-forms'); 
    }

    public function packageUnitsCatalog(Request $request, Shop $shop)
    {   
        return Inertia::render('shop/catalog/package-units'); 
    }
}   
