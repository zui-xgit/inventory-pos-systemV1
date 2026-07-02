<?php

namespace App\Models\Catalog;

use App\Traits\BelongsToShop;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

#[Guarded('id')]
class Unit extends Model
{
    /** @use HasFactory<\Database\Factories\UnitFactory> */
    use HasFactory;
    use BelongsToShop;
    use HasUuids; 
    
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
