<?php

namespace App\Models\Catalog;

use App\Traits\BelongsToShop;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Guarded;

#[Guarded('id')]
class Unit extends Model
{
    /** @use HasFactory<\Database\Factories\UnitFactory> */
    use HasFactory;
    use BelongsToShop;

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
