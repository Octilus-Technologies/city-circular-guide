<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStopsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('stops', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_interchange')->nullable();
            $table->boolean('is_terminal')->nullable();
            $table->json('meta')->nullable();
            $table->foreignId('previous_stop_id')->nullable()->constrained('stops');
            $table->foreignId('next_stop_id')->nullable()->constrained('stops');
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
        Schema::dropIfExists('stops');
    }
}
