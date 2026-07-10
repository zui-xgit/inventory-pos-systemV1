<?php

namespace App\Http\Controllers\Stock;

use App\Http\Controllers\Controller;
use App\Models\Catalog\Batch;
use App\Models\Catalog\Product;
use App\Models\Core\Shop;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StockController extends Controller
{
    // STOCK
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

        return Inertia::render("shop/stock/receive-stock", [
            'products' => $products,
            'package_units' => $package_units,
            'dosage_forms' => $dosage_forms,
            'filters'  => $request->only(['search']),
            'shop_uuid' => $shop->uuid, 
            'search_input' => $search_input
        ]);
    }   
    
    public function stockHistory(Shop $shop)
    {
      return Inertia::render("shop/stock/stock-history"); 
    }

    public function createBatch(Request $request, Shop $shop)
    {
        $request->merge([
            'batch_number' => strtolower($request->input('batch_number')),
        ]);

        $validated = $request->validate([
            'product'                    => ['required', 'array'],
            'product.uuid'               => ['required', 'uuid', Rule::exists('products', 'uuid')->where('shop_id', $shop->id)],
            'batch_number'               => ['required', 'string', 'max:100'],
            'cost_price'                 => ['required', 'numeric', 'min:0'],
            'selling_price'              => ['required', 'numeric', 'min:0', 'gte:cost_price'], 
            'manufactured_date'          => ['required', 'date', 'before_or_equal:today'],
            'expiry_date'                => ['required', 'date', 'after:today'],
            'units_per_package_received' => ['required', 'integer', 'min:1'],
            'packages_received'          => ['required', 'integer', 'min:1'],
        ]);
        
        try {
            DB::beginTransaction(); 

            $product = Product::where('uuid', $validated['product']['uuid'])
                ->where('shop_id', $shop->id)
                ->firstOrFail();

            // 1. Calculate total calculated stock quantities inline
            $totalQuantityReceived = $validated['units_per_package_received'] * $validated['packages_received'];

            // 2. Persist the database record
            Batch::create([
                'shop_id'                    => $shop->id,
                'product_id'                 => $product->id,
                'batch_number'               => $validated['batch_number'],
                'expiry_date'                => $validated['expiry_date'],
                'manufactured_date'          => $validated['manufactured_date'],
                'units_per_package_received' => $validated['units_per_package_received'],
                'packages_received'          => $validated['packages_received'],
                'quantity_received'          => $totalQuantityReceived,
                'quantity_remaining'         => $totalQuantityReceived, 
                'cost_price'                 => $validated['cost_price'],
                'selling_price'              => $validated['selling_price'],
            ]);

            DB::commit();


        } catch (Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Failed to create the batch record. Please try again.');
        }
    }

}
