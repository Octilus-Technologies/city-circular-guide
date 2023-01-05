<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Fare extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'amount',
        'meta',
        'segment_id',
        'route_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'amount' => 'decimal',
        'meta' => 'array',
        'segment_id' => 'integer',
        'route_id' => 'integer',
    ];

    public function segment()
    {
        return $this->belongsTo(Segment::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }
}
