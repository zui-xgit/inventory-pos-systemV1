<?php

namespace App\Models\Catalog;

use App\Models\Inventory\Batch;
use App\Traits\BelongsToShop;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;


#[Guarded('id')]
class Supplier extends Model
{
    /** @use HasFactory<\Database\Factories\SupplierFactory> */
    use HasFactory;
    use BelongsToShop; 
    use SoftDeletes; 

    // -------------------------------------------------------------------------
    // Relations
    // -------------------------------------------------------------------------
 
    public function batches(): HasMany
    {
        return $this->hasMany(Batch::class);
    }
}
