<?php

namespace App\Models\Sales;

use App\Traits\BelongsToShop;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    /** @use HasFactory<\Database\Factories\Sales\SaleFactory> */
    use HasFactory;
    use BelongsToShop; 
}
