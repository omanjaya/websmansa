<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
final class CategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(2, true);

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.$this->faker->unique()->numberBetween(1000, 9999),
            'description' => $this->faker->sentence(10),
            'parent_id' => null,
            'order' => $this->faker->numberBetween(0, 100),
        ];
    }
}
