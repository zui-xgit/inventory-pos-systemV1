<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Catalog\Batch;
use App\Models\Catalog\DosageForm;
use App\Models\Catalog\PackageUnit;
use App\Models\Catalog\Product;
use App\Models\Core\Shop;
use Exception;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CatalogController extends Controller
{
    //

     // CATALOG 
    public function productsCatalog(Request $request, Shop $shop)
    {
    

        $search_input = $request->input('search'); 
        $search = strtolower($search_input);

        $products = Product::where('shop_id', $shop->id)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('sku', 'LIKE', "%{$search}%");
                });
            })
            ->with([
                'dosageForm:id,uuid,name',
                'packageUnit:id,uuid,name'
            ])
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function ($product) {
                return [
                    'uuid'         => $product->uuid,
                    'name'         => $product->name,
                    'sku'          => $product->sku ?? 'N/A',
                    'is_active'    => $product->is_active,
                    'dosage_form'  => [
                        'uuid' => $product->dosageForm?->uuid,
                        'name' => $product->dosageForm?->name ?? 'N/A',
                    ],
                    'package_unit' => [
                        'uuid' => $product->packageUnit?->uuid,
                        'name' => $product->packageUnit?->name ?? 'N/A',
                    ],
                ];
        });

        $package_units = $shop->packageUnits()->get(['uuid', 'name']);
        $dosage_forms = $shop->dosageForms()->get(['uuid', 'name']);


        return Inertia::render('shop/catalog/products', [
            'products' => $products,
            'filters'  => $request->only(['search']),
            'package_units' => $package_units, 
            'dosage_forms' => $dosage_forms
        ]); 
        
    }

    public function batchesCatalog(Request $request, Shop $shop)
    {   
        $search_input = $request->input('search'); 
        $search = strtolower($search_input);

        $batches = Batch::where('shop_id', $shop->id)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('batch_number', 'LIKE', "%{$search}%")
                    ->orWhereHas('product', function ($productQuery) use ($search) {
                        $productQuery->where('name', 'LIKE', "%{$search}%");
                    });
                });
            })
            ->with(['product:id,uuid,name']) // Eager-load parent product details securely
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($batch) {
                return [
                    'uuid'                        => $batch->uuid,
                    'batch_number'                => $batch->batch_number,
                    'product_name'                => $batch->product?->name ?? 'Unknown Product',
                    'units_per_package_received'  => $batch->units_per_package_received,
                    'packages_received'           => $batch->packages_received,
                    'quantity_received'           => $batch->quantity_received,
                    'current_quantity'            => $batch->current_quantity ?? $batch->quantity_received,
                    'cost_price'                  => $batch->cost_price,
                    'selling_price'               => $batch->selling_price,
                    'expiry_date'                 => $batch->expiry_date ? $batch->expiry_date->format('Y-m-d') : 'N/A',
                    'is_expired'                  => $batch->expiry_date ? $batch->expiry_date->isPast() : false,
                ];
        });
        
        return Inertia::render('shop/catalog/batches', [
            'batches' => $batches,
            'filters' => $request->only(['search']),
        ]); 
    }

    public function dosageFormsCatalog(Request $request, Shop $shop)
    {   
        $search_input = $request->input('search'); 
        $search = strtolower($search_input);


        $dosageForms = DosageForm::where('shop_id', $shop->id)
            ->when($search, function ($query, $search) {
                $query->where('name', 'LIKE', "%{$search}%");
            })
            ->withCount(['products']) // Useful to show how many products use this form
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($form) {
                return [
                    'uuid'           => $form->uuid,
                    'name'           => $form->name,
                    'products_count' => $form->products_count,
                    'is_active'      => $form->is_active ?? true,
                ];
        });
        return Inertia::render('shop/catalog/dosage-forms', [
            'dosageForms' => $dosageForms,
            'filters'     => $request->only(['search']),
        ]);
    }

    public function packageUnitsCatalog(Request $request, Shop $shop)
    {   
        $search_input = $request->input('search'); 
        $search = strtolower($search_input);

        $packageUnits = PackageUnit::where('shop_id', $shop->id)
            ->when($search, function ($query, $search) {
                $query->where('name', 'LIKE', "%{$search}%");
            })
            ->withCount(['products']) // Eager-load relation volume
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($unit) {
                return [
                    'uuid'           => $unit->uuid,
                    'name'           => $unit->name,
                    'products_count' => $unit->products_count,
                    'is_active'      => $unit->is_active ?? true,
                ];
        });

        return Inertia::render('shop/catalog/package-units', [
            'packageUnits' => $packageUnits,
            'filters'      => $request->only(['search']),
        ]); 
    }

    public function createPackageUnit(Request $request, Shop $shop )
    {
        $request->merge([
            'name' => strtolower($request->input('name')),
        ]);

        $validated = $request->validate([   
            'name' => [
                'required',
                'string',
                'max:255',
                // Checks the 'units' table, ensuring 'name' is unique where 'shop_id' matches the current shop
                Rule::unique('package_units')->where(function ($query) use ($shop) {
                    return $query->where('shop_id', $shop->id);
                }),
            ],
        ]); 


        try{
            DB::beginTransaction();
            $shop->packageUnits()->create([
                'name' => $validated['name'],
            ]);
            DB::commit();
        }catch(Exception $e){
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to create unit: ']);
        }
    }

    public function createDosageForm(Request $request, Shop $shop)
    {

        $request->merge([
           'name' => strtolower($request->input('name')),
        ]);

        $validated = $request->validate([   
            'name' => [
                'required',
                'string',
                'max:255',
                // Checks the 'dosage_forms' table, ensuring 'name' is unique where 'shop_id' matches the current shop
                Rule::unique('dosage_forms')->where(function ($query) use ($shop) {
                    return $query->where('shop_id', $shop->id);
                }),
            ],
        ]); 


        try{
            DB::beginTransaction();
            $shop->dosageForms()->create([
                'name' => $validated['name'],
            ]);
            DB::commit();
        }catch(Exception $e){
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to create dosage form: ']);
        }
    }

    public function createProduct(Request $request, Shop $shop)
    {

        $request->merge([
            'name' => strtolower($request->input('name')), 
            'sku' => strtolower($request->input('sku')),
        ]);


       $validated  = $request->validate([
            'name' => 'required|string|max:255',
            'dosage_form_uuid' => [
                'required',
                'exists:dosage_forms,uuid', // Ensure the form exists in the dosage_forms table
            ],
            'package_unit_uuid' => [
                'required',
                'exists:package_units,uuid', // Ensure the unit exists in the units table
            ],
            'sku' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products')->where(function ($query) use ($shop) {
                    return $query->where('shop_id', $shop->id);
                }),
            ],
        ]);


        try {
            DB::beginTransaction();

            // Fetch the unit by UUID
            $dosage_form = $shop->dosageForms()->where('uuid', $validated['dosage_form_uuid'])->firstOrFail();
            $package_unit = $shop->packageUnits()->where('uuid', $validated['package_unit_uuid'])->firstOrFail();

            // Create the product with the associated unit_id
            $shop->products()->create([
                'name' => $validated['name'],
                'dosage_form_id' => $dosage_form->id, 
                'package_unit_id' => $package_unit->id,
                'sku' => $validated['sku'],
            ]);

            DB::commit();
        } catch(UniqueConstraintViolationException $e){ 
            DB::rollBack();
            return back()->withErrors(['error' => 'A product with this identical name, dosage form, and package unit already exists.']);   
        } catch (Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to create product: ']);
        }

        
    }
}
