<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trip extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'expected_start_time',
        'expected_end_time',
        'start_time',
        'end_time',
        'bus_id',
        'route_id',
        'meta',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'expected_start_time' => 'datetime',
        'expected_end_time' => 'datetime',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'bus_id' => 'integer',
        'route_id' => 'integer',
        'meta' => 'array',
    ];

    public function bus()
    {
        return $this->belongsTo(Bus::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }
}
