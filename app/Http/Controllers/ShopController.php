<?php

namespace App\Http\Controllers;

use App\Models\Core\Shop;
use App\Models\Inventory\Alert;
use App\Models\Sales\Sale;
use App\Models\Sales\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->where('sales.shop_id', $shop->id)
            ->whereDate('sales.created_at', $today)
            ->where('sales.status', 'completed')
            ->select(
                'products.id',
                'products.name',
                'products.form',
                DB::raw('SUM(sale_items.quantity) as units_sold'),
                DB::raw('SUM(sale_items.subtotal) as revenue'),
            )
            ->groupBy('products.id', 'products.name', 'products.form')
            ->orderByDesc('units_sold')
            ->take(5)
            ->get()
            ->map(fn($product) => [
                'id'         => $product->id,
                'name'       => $product->name,
                'form'       => $product->form,
                'units_sold' => (int) $product->units_sold,
                'revenue'    => number_format($product->revenue, 2),
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

   public function newSalePos(Shop $shop)
   {
     return Inertia::render("shop/sales/new-sale-pos"); 
   }

   public function salesHistory(Shop $shop)
   {
     return Inertia::render("shop/sales/sales-history"); 
   }
}
