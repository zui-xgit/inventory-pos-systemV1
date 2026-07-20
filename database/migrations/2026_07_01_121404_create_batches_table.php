<?php

use App\Models\Catalog\Product;
use App\Models\Core\Shop;
use App\Models\Catalog\Supplier;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique(); 
 
            $table->foreignIdFor(Shop::class)
                ->constrained()
                ->cascadeOnDelete();
 
            $table->foreignIdFor(Product::class)
                ->constrained()
                ->restrictOnDelete(); // cannot delete a product that has batches
 
            // Supplier is nullable — batch can be received without a known supplier
            $table->foreignIdFor(Supplier::class)
                ->nullable()
                ->constrained()
                ->nullOnDelete();
 
            $table->string('batch_number'); // manufacturer batch number
            
            $table->date('expiry_date');   
            $table->date('manufactured_date');
 
            $table->integer('units_per_package_received');
            $table->integer('packages_received'); 


            $table->integer('cost_price');        // buying price per unit
            $table->integer('selling_price');     // selling price per unit
 
            $table->timestamps();
 
            // batch number must be unique per product per shop
            $table->unique(['shop_id', 'product_id', 'batch_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};
