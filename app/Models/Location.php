<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Location extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'lng',
        'lat',
        'landmark',
        'address',
        'meta',
        'user_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'address' => 'array',
        'meta' => 'array',
        'user_id' => 'integer',
    ];


    // * Accessors and Mutators

    protected function coordinates(): Attribute
    {
        return Attribute::make(
            get: fn () => [
                'lng' => $this->lng,
                'lat' => $this->lat,
            ],
        );
    }


    // * Relationships

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
