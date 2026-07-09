<?php

use App\Http\Controllers\OwnerController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');


Route::middleware(['auth', 'verified', 'shop.member'])->group(function (){

    //overview 
    Route::get('shops/{shop:uuid}', [ShopController::class, "overviewDashboard"])->name('shop-overview'); 
   
    //Sales
    Route::get('shops/{shop:uuid}/new-sale-pos', [ShopController::class, "newSalePos"])->name('sales.new-sale-pos'); 
    Route::get('shops/{shop:uuid}/sales-history', [ShopController::class, "salesHistory"])->name('sales.history'); 
    
    


    //Purchases
    Route::get('shops/{shop:uuid}/new-purchase', [ShopController::class, "receiveStock"])->name('purchases.receive-stock'); 
    Route::get('shops/{shop:uuid}/purchases-history', [ShopController::class, "purchasesHistory"])->name('purchases.history');
    Route::post('shops/{shop:uuid}/new-package-unit', [ShopController::class, "createPackageUnit"])->name('purchases.new-package-unit');
    Route::post('shops/{shop:uuid}/new-dosage-form', [ShopController::class, "createDosageForm"])->name('purchases.new-dosage-form');
    Route::post('shops/{shop:uuid}/new-product', [ShopController::class, "createProduct"])->name('purchases.new-product');
    Route::post('shops/{shop:uuid}/new-batch', [ShopController::class, "createBatch"])->name('purchases.new-batch');

    // // catalog
    Route::get('shops/{shop:uuid}/catalog/products', [ShopController::class, "productsCatalog"])->name('catalog.products'); 
    Route::get('shops/{shop:uuid}/catalog/batches', [ShopController::class, "batchesCatalog"])->name('catalog.batches'); 
    Route::get('shops/{shop:uuid}/catalog/dosage-forms', [ShopController::class, "dosageFormsCatalog"])->name('catalog.dosage-forms'); 
    Route::get('shops/{shop:uuid}/catalog/package-units', [ShopController::class, "packageUnitsCatalog"])->name('catalog.package-units'); 

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
