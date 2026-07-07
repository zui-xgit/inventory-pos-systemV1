<?php

use App\Http\Controllers\OwnerController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');


Route::middleware(['shop.member'])->group(function (){

    //overview 
    Route::get('shops/{shop:uuid}', [ShopController::class, "overviewDashboard"])->name('shop-overview'); 
   
    //Sales
    Route::get('shops/{shop:uuid}/new-sale-pos', [ShopController::class, "newSalePos"])->name('sales.new-sale-pos'); 
    Route::get('shops/{shop:uuid}/sales-history', [ShopController::class, "salesHistory"])->name('sales.history'); 

    // // inventory
    // Route::get('shops/{shop:uuid}', [ShopController::class, "inventoryProducts"])->name('inventory.products'); 
    // Route::get('shops/{shop:uuid}', [ShopController::class, "inventoryBatches"])->name('inventory.batches'); 
    // Route::get('shops/{shop:uuid}', [ShopController::class, "inventorySuppliers"])->name('inventory.suppliers'); 
    // Route::get('shops/{shop:uuid}', [ShopController::class, "inventoryUnits"])->name('inventory.units'); 

    // // Stock
    // Route::get('shops/{shop:uuid}', [ShopController::class, "stockLevels"])->name('stock.levels'); 
    // Route::get('shops/{shop:uuid}', [ShopController::class, "stockTaking"])->name('stock.taking'); 
    // Route::get('shops/{shop:uuid}', [ShopController::class, "stockMovement"])->name('stock.movement'); 

    // // Reports
    // Route::get('shops/{shop:uuid}', [ShopController::class, "reportSales"])->name('reports.sales'); 
    // Route::get('shops/{shop:uuid}', [ShopController::class, "reportProfitLoss"])->name('reports.profit-loss'); 
    // Route::get('shops/{shop:uuid}', [ShopController::class, "reportHistory"])->name('reports.purchase-history');
    // Route::get('shops/{shop:uuid}', [ShopController::class, "reportInventoryStock"])->name('reports.inventory-stock');
    // Route::get('shops/{shop:uuid}', [ShopController::class, "reportInventoryExpiry"])->name('reports.inventory-expiry');
    // Route::get('shops/{shop:uuid}', [ShopController::class, "reportInventoryMovers"])->name('reports.inventory-movers');


    //Alerts
    // Route::get('shops/{shop:uuid}', [ShopController::class, "alertsLowStock"])->name('alerts.low-stock');
    // Route::get('shops/{shop:uuid}', [ShopController::class, "alertsExpiringSoon"])->name('alerts.expiring-soon');


    //Management
    // Route::get('shops/{shop:uuid}', [ShopController::class, "managementStaff"])->name('management.staff');
    // Route::get('shops/{shop:uuid}', [ShopController::class, "managementShopSettings"])->name('management.shop-settings');


    //Account
    // Route::get('shops/{shop:uuid}', [ShopController::class, "accountProfile"])->name('account.profile');
    
    
    
    

    

});



Route::prefix('owner')->group(function (){
    require __DIR__.'/owner.php';
});


require __DIR__.'/settings.php';
