<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Route extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'meta',
        'is_clockwise',
        'circular_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'meta' => 'array',
        'is_clockwise' => 'boolean',
        'circular_id' => 'integer',
    ];

    public function segments()
    {
        return $this->hasMany(Segment::class);
    }

    public function stops()
    {
        return $this->hasMany(Stop::class);
    }

    public function circular()
    {
        return $this->belongsTo(Circular::class);
    }
}
