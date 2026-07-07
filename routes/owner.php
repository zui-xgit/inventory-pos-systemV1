<?php

use App\Http\Controllers\OwnerController;
use Illuminate\Support\Facades\Route;



Route::middleware(['auth', 'verified', 'role:owner'])->group(function () {
    // OVERVIEW
    Route::get('shops', [OwnerController::class, 'shops'])->name('owner.shops'); 

    // MANAGEMENT
    Route::get('shops/staff', [OwnerController::class, 'staff'])->name("owner.staff"); 
    Route::post('create-shop', [OwnerController::class, 'createShop'])->name("owner.create-shop"); 
    Route::post('activiy-logs', [OwnerController::class, 'activityLogs'])->name('owner.activity-logs');

    // ACCOUNT
    // Route::get('profile', [OwnerController::class, 'profile'])->name('owner.profile'); 
    // Route::get('settings', [OwnerController::class, 'settings'])->name('owner.settings'); 

    

}); 