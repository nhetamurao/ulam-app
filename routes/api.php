<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\ProvinceController;
use App\Http\Controllers\Api\LocalityController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\ShopPhotoController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Note: /shops (index) supports query parameters for the Discover page:
|   - q                : search text
|   - region_id        : filter by region
|   - province_id      : filter by province
|   - locality_id      : filter by locality
|   - price_level      : budget | mid | treat
|   - sort             : name_asc | name_desc | price_asc | price_desc
|   - page, per_page   : pagination
|
*/

// ----------------------
// Authentication
// ----------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ----------------------
// Regions / Provinces / Localities
// ----------------------
Route::get('/regions', [RegionController::class, 'index']);
Route::get('/regions/{id}', [RegionController::class, 'show']);

Route::get('/provinces', [ProvinceController::class, 'index']);
Route::get('/provinces/{id}', [ProvinceController::class, 'show']);
Route::get('/regions/{region_id}/provinces', [ProvinceController::class, 'byRegion']);

Route::get('/localities', [LocalityController::class, 'index']);
Route::get('/localities/{id}', [LocalityController::class, 'show']);
Route::get('/provinces/{province_id}/localities', [LocalityController::class, 'byProvince']);

// ----------------------
// Shops (public browse + show)
// ----------------------
// GET /shops will now apply filters/pagination via ShopController@index
Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/{shop}', [ShopController::class, 'show']);

// ----------------------
// Public: view photos, comments, likes
// ----------------------
Route::get('/shops/{shop}/photos', [ShopPhotoController::class, 'index']);
Route::get('/shops/{shop}/comments', [CommentController::class, 'index']);
Route::get('/shops/{shop}/likes', [LikeController::class, 'count']);

// ----------------------
// Protected: needs Bearer token (auth:sanctum)
// ----------------------
Route::middleware('auth:sanctum')->group(function () {
    // Authenticated user info
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Shops (create / update / delete)
    Route::post('/shops', [ShopController::class, 'store']);
    Route::put('/shops/{shop}', [ShopController::class, 'update']);
    Route::delete('/shops/{shop}', [ShopController::class, 'destroy']);

    // Photos (create/delete)
    Route::post('/shops/{shop}/photos', [ShopPhotoController::class, 'store']);
    Route::delete('/shops/{shop}/photos/{photo_id}', [ShopPhotoController::class, 'destroy']);

    // Comments
    Route::post('/shops/{shop}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // Likes
    Route::post('/shops/{shop}/like', [LikeController::class, 'like']);
    Route::delete('/shops/{shop}/like', [LikeController::class, 'unlike']);

    // Profile data
    Route::get('/me/shops', [ShopController::class, 'myShops']);
    Route::get('/me/comments', [CommentController::class, 'myComments']);
});
