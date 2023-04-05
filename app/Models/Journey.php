<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Journey extends Model
{
    use HasFactory;
    use SoftDeletes;
    use HasUuids;

    protected $primaryKey = 'uuid';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'from_id',
        'destination_id',
        'expected_start_time',
        'expected_end_time',
        'start_time',
        'end_time',
        'meta',
        'user_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'from_id' => 'integer',
        'destination_id' => 'integer',
        'expected_start_time' => 'datetime',
        'expected_end_time' => 'datetime',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'meta' => 'array',
        'user_id' => 'integer',
    ];

    protected $with = [
        'from',
        'destination'
    ];

    protected $appends = [
        'time_ago'
    ];


    // * Relationships

    public function from()
    {
        return $this->belongsTo(Location::class);
    }

    public function destination()
    {
        return $this->belongsTo(Location::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    // * Accessors

    public function getTimeAgoAttribute()
    {
        return $this->created_at->diffForHumans();
    }
}
