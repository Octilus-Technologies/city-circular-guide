<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Segment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'from_stop_id',
        'to_stop_id',
        'distance',
        'geoJson',
        'meta',
        'route_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'from_stop_id' => 'integer',
        'to_stop_id' => 'integer',
        'distance' => 'decimal',
        'geoJson' => 'array',
        'meta' => 'array',
        'route_id' => 'integer',
    ];

    public function fares()
    {
        return $this->hasMany(Fare::class);
    }

    public function fromStop()
    {
        return $this->belongsTo(Stop::class);
    }

    public function toStop()
    {
        return $this->belongsTo(Stop::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }
}
