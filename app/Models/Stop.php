<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stop extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'is_interchange',
        'is_terminal',
        'meta',
        'previous_stop_id',
        'next_stop_id',
        'route_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'is_interchange' => 'boolean',
        'is_terminal' => 'boolean',
        'meta' => 'array',
        'previous_stop_id' => 'integer',
        'next_stop_id' => 'integer',
        'route_id' => 'integer',
    ];

    public function previousStop()
    {
        return $this->belongsTo(Stop::class);
    }

    public function nextStop()
    {
        return $this->belongsTo(Stop::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }
}
