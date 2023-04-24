<?php

use App\Models\User;
use Inertia\Inertia;
use App\Models\Journey;
use App\Models\Feedback;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProxyController;
use App\Http\Controllers\JourneyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\JourneyAdminController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [JourneyController::class, 'welcome'])->name('welcome');
Route::get('journey/{journey}', [JourneyController::class, 'journey'])->name('journey');
Route::post('journey', [JourneyController::class, 'startJourney'])->name('journey.start');

Route::get('map-api/{path}', [ProxyController::class, 'mapProxy'])->name('proxy.map-api')->where('path', '.*');

Route::resource('faq', FaqController::class)->only(['index', 'show']);
Route::get('contact', [FeedbackController::class, 'create'])->name('feedback.create');
Route::post('contact', [FeedbackController::class, 'store'])->name('feedback.store');

Route::get('dashboard', function () {
    try {
        $journeyCount = Journey::count();
        $userCount = User::count();
        $journeys = Journey::latest()->paginate();
        $feedbackCount = 0; // fallback (table might not be there)
        $feedbackCount = Feedback::count();
    } catch (\Throwable $th) {
        //throw $th;
    }

    return Inertia::render('Dashboard', compact('journeyCount', 'feedbackCount', 'userCount', 'journeys'));
})->middleware(['auth', 'admin'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class)->only(['index', 'show', 'destroy']);
        Route::resource('feedbacks', FeedbackController::class)->only(['index', 'show']);
        Route::resource('journeys', JourneyAdminController::class)->only(['index']);
    });
});

require __DIR__ . '/auth.php';
