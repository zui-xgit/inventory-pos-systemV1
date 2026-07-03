<?php

namespace Database\Seeders;

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

    
        $owner_user = User::factory()->create([
            'username' => 'jacob.athuman', 
            'firstname' => 'jacob', 
            'lastname' => 'athuman'
        ]);

        // $owner_user->assignRole($owner_role); 

    }
}
