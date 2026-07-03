<?php

use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('shops', [ShopController::class, 'shops'])->name('owner.shops'); 
    Route::get('shops/manage-users', [ShopController::class, 'manageUsers'])->name("owner.manage-users"); 
    Route::post('create-shop', [ShopController::class, 'createShop'])->name("owner.create-shop"); 
}); 

require __DIR__.'/settings.php';
