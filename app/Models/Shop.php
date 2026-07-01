<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

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
}
