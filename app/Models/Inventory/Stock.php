<?php

namespace App\Models\Inventory;

use App\Models\Catalog\Product;
use App\Models\Inventory\Batch;
use App\Traits\BelongsToShop;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Guarded('id')]
class Stock extends Model
{
    /** @use HasFactory<\Database\Factories\StockFactory> */
    use HasFactory;
    use BelongsToShop; 

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
             'quantity' => 'decimal:2',
        ];
    }
 
    // -------------------------------------------------------------------------
    // Relations
    // -------------------------------------------------------------------------
 
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
 
    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }
 
    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
 
    /**
     * True if this stock row has no remaining quantity.
     */
    public function isEmpty(): bool
    {
        return $this->quantity <= 0;
    }


}
