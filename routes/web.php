<?php

use App\Http\Controllers\Catalog\CatalogController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\Stock\StockController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');


Route::middleware(['auth', 'verified', 'shop.member'])->group(function (){

    //SHOP OVERVIEW
    Route::get('shops/{shop:uuid}', [ShopController::class, "overviewDashboard"])->name('shop-overview'); 
   
    //SALES
    Route::get('shops/{shop:uuid}/new-sale-pos', [ShopController::class, "newSalePos"])->name('sales.new-sale-pos'); 
    Route::get('shops/{shop:uuid}/sales-history', [ShopController::class, "salesHistory"])->name('sales.history'); 
    
    



    //CATALOG
    Route::get('shops/{shop:uuid}/catalog/products', [CatalogController::class, "productsCatalog"])->name('catalog.products'); 
    Route::get('shops/{shop:uuid}/catalog/batches', [CatalogController::class, "batchesCatalog"])->name('catalog.batches'); 
    Route::get('shops/{shop:uuid}/catalog/dosage-forms', [CatalogController::class, "dosageFormsCatalog"])->name('catalog.dosage-forms'); 
    Route::get('shops/{shop:uuid}/catalog/package-units', [CatalogController::class, "packageUnitsCatalog"])->name('catalog.package-units'); 
    Route::post('shops/{shop:uuid}/catalog/new-package-unit', [CatalogController::class, "createPackageUnit"])->name('catalog.new-package-unit');
    Route::post('shops/{shop:uuid}/catalog/new-dosage-form', [CatalogController::class, "createDosageForm"])->name('catalog.new-dosage-form');
    Route::post('shops/{shop:uuid}/catalog/new-product', [CatalogController::class, "createProduct"])->name('catalog.new-product');


    // Stock
    Route::get('shops/{shop:uuid}/stock/receive-stock', [StockController::class, "receiveStock"])->name('stock.receive-stock'); 
    Route::get('shops/{shop:uuid}/stock/stock-history', [StockController::class, "stockHistory"])->name('stock.history');
    Route::post('shops/{shop:uuid}/stock/new-batch', [StockController::class, "createBatch"])->name('stock.new-batch');

     

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
