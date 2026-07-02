<?php

namespace App\Models\Core;

use App\Models\Catalog\Product;
use App\Models\Catalog\Supplier;
use App\Models\Catalog\Unit;
use App\Models\Inventory\Batch;
use App\Models\Inventory\Stock;
use App\Models\Inventory\StockMovement;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(
    'name',
    'slug',
    'address',
    'phone',
    'email',
    'currency',
    'currency_symbol',
    'timezone',
    'logo_path',
    'low_stock_threshold',
    'expiry_alert_days',
    'is_active',
)]
#[Hidden(
    'id',
    'deleted_at',
)]
class Shop extends Model
{
    /** @use HasFactory<\Database\Factories\ShopFactory> */
    use HasFactory;
    use HasUuids; 

    public function uniqueIds(): array
    {
        return ['uuid'];
    }   


    public function staff(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, 'shop_user'); 
    }

    
    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function suppliers(): HasMany
    {
        return $this->hasMany(Supplier::class);
    }

    public function batches(): HasMany
    {
        return $this->hasMany(Batch::class);
    }

    public function stock(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    
}
