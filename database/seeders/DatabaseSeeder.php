<?php

namespace Database\Seeders;

use App\Models\Core\Shop;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $owner_role = Role::create(['name' => 'owner']);
        $manager_role = Role::create(['name' => 'manager']);
        $cashier_role = Role::create(['name' => 'cashier']);

    
        // User A (owner)
        $userA = User::factory()->create([
            'username' => 'owner.owner', 
            'firstname' => 'jacob', 
            'lastname' => 'athuman'
        ]); 
        $userA->assignRole($owner_role); 


        $userB = User::factory()->create([
            'username' => 'manager.manager', 
            'firstname' => 'Alex', 
            'lastname' => 'Ronaldo', 
        ]);
        $userB->assignRole($manager_role); 


        $userC = User::factory()->create([
            'username' => 'cashier.cashier', 
            'firstname' => 'Lamine', 
            'lastname' => 'Yamal', 
        ]);
        $userC->assignRole($cashier_role); 


        $shop = Shop::factory()->create(); 
        $shop->users()->attach($userB->id); 
        $shop->users()->attach($userC->id); 


        


    }
}
