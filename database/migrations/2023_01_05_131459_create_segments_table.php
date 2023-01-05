<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSegmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('segments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_stop_id')->constrained('stops');
            $table->foreignId('to_stop_id')->constrained('stops');
            $table->unsignedDecimal('distance')->nullable();
            $table->json('geoJson')->nullable();
            $table->json('meta')->nullable();
            $table->foreignId('route_id')->nullable()->constrained();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('segments');
    }
}
