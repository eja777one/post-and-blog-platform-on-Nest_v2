
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/hometask_30/api/testing/all-data": {
        "delete": {
          "operationId": "TestsController_deleteAllData",
          "summary": "Delete all data from DB",
          "parameters": [],
          "responses": {
            "204": {
              "description": "All data was deleted"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Test"
          ]
        }
      },
      "/hometask_30/api/testing/user/{email}": {
        "get": {
          "operationId": "TestsController_getUser",
          "summary": "Get user info by email",
          "parameters": [
            {
              "name": "email",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "User info was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserTestViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "User was not found"
            }
          },
          "tags": [
            "Test"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/hometask_30/api/testing/session/{userId}": {
        "get": {
          "operationId": "TestsController_getUsersSessions",
          "summary": "Get user's sessions info by userId",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "User's sessions was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/DeviceViewModel"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "User was not found"
            }
          },
          "tags": [
            "Test"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/hometask_30/api/testing/code/{id}": {
        "get": {
          "operationId": "TestsController_getCodeData",
          "summary": "Get user's recovery code data",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Code data was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PassRecTestViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "User was not found"
            }
          },
          "tags": [
            "Test"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/hometask_30/api/blogs/{blogId}/subscription": {
        "post": {
          "operationId": "BlogsController_subscribeToBlog",
          "summary": "Subscribe user to blog. Notification about new posts will be send to Telegram Bot",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "User was subscribe to blog"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Blog was not found"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "BlogsController_unsubscribeFromBlog",
          "summary": "Unsubscribe user from blog. Notification about new posts will not send to Telegram Bot",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "User was unsubscribe from blog"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Blog was not found"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/blogs": {
        "get": {
          "operationId": "BlogsController_getBlogs",
          "summary": "Return all blogs with paging",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show blogs with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show blogs with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show blogs with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting blogs by param (default: createdAt)",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "description": "Find term in blog's name (default: null)",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Blogs was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_BlogViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogs"
          ]
        },
        "post": {
          "operationId": "BlogsController_createPostNoBlogger",
          "summary": "Create blog without link to blog (for test)",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlogInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Blog was created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Blog was not found"
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/hometask_30/api/blogs/{id}/posts": {
        "get": {
          "operationId": "BlogsController_getBlogsPosts",
          "summary": "Return all blog's posts with paging",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show blog's posts with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show blog's posts with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show blog's posts with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting blog's posts by param (default: createdAt)",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Blog's posts was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_PostViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Blog was not found"
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/hometask_30/api/blogs/{id}": {
        "get": {
          "operationId": "BlogsController_getBlog",
          "summary": "Return blog by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Blog was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Blog was not found"
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/hometask_30/api/blogger/blogs/{blogId}/images/wallpaper": {
        "post": {
          "operationId": "BloggerBlogsController_uploadWallpaper",
          "summary": "Upload background wallpaper for Blog (.png or .jpg/.jpeg) file (max size is 100KB, width must be 1028px, height must be 312px) ",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Wallpaper was uploaded",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogsImagesViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Blogger try to manipulate with not own blog (update, delete, add post, etc...)"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/blogger/blogs/{blogId}/images/main": {
        "post": {
          "operationId": "BloggerBlogsController_uploadMainImage",
          "summary": "Upload main square image for Blog (.png or .jpg/.jpeg) file (max size is 100KB, width must be 156px, height must be 156px) ",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Wallpaper was uploaded",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogsImagesViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Blogger try to manipulate with not own blog (update, delete, add post, etc...)"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/blogger/blogs/{blogId}/posts/{postId}/images/main": {
        "post": {
          "operationId": "BloggerBlogsController_uploadPostMainImage",
          "summary": "Upload main image for Post (.png or .jpg/.jpeg) file (max size is 100KB, width must be 940px, height must be 432px) ",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Wallpaper was uploaded",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostImagesViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Blogger try to manipulate with not own blog (update, delete, add post, etc...)"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/blogger/blogs": {
        "post": {
          "operationId": "BloggerBlogsController_createBlog",
          "summary": "Blogger can create new blog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlogInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Blog was created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "BloggerBlogsController_getBlogs",
          "summary": "Blogger can get all own blogs",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show blogs with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show blogs with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show blogs with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting blogs by param (default: createdAt)",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "description": "Find term in blog's name (default: null)",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Blogger's blogs was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_BlogViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/blogger/blogs/{id}": {
        "put": {
          "operationId": "BloggerBlogsController_updateBlog",
          "summary": "Blogger can update own blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlogInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Blog was updated"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Blogger try to manipulate with not own blog (update, delete, add post, etc...)"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "BloggerBlogsController_deleteBlog",
          "summary": "Blogger can delete own blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Blog was deleted"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Blogger try to manipulate with not own blog (update, delete, add post, etc...)"
            },
            "404": {
              "description": "Blog was not found"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/blogger/blogs/{id}/posts": {
        "post": {
          "operationId": "BloggerBlogsController_createBlogsPosts",
          "summary": "Blogger can create post for own blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostInputModelNoId"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Post was created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Blogger try to manipulate with not own blog (update, delete, add post, etc...)"
            },
            "404": {
              "description": "Blog was not found"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/blogger/blogs/{id}/posts/{postId}": {
        "put": {
          "operationId": "BloggerBlogsController_updateBlogsPosts",
          "summary": "Blogger can update own post for own blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostInputModelNoId"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Post was updated"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Blogger try to manipulate with not own blog (update, delete, add post, etc...)"
            },
            "404": {
              "description": "Blog was not found"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "BloggerBlogsController_deleteBlogsPosts",
          "summary": "Blogger can delete own post for own blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Post was deleted"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Blogger try to manipulate with not own blog (update, delete, add post, etc...)"
            },
            "404": {
              "description": "Blog was not found"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/blogger/blogs/comments": {
        "get": {
          "operationId": "BloggerBlogsController_getBloggerBlogComments",
          "summary": "Return all comments for posts, which link with blogs, which owner is blogger",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show comments with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show comments with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show comments with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting comments by param (default: createdAt)",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Comments was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_CommentWithPostViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogger Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/sa/blogs/{id}/ban": {
        "put": {
          "operationId": "SuperAdminBlogsController_setBanStatusForBlog",
          "summary": "SA can ban/unban blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SaBanBlogInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Blog was banned/unbanned"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "SuperAdmin Blogs"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/hometask_30/api/sa/blogs/{id}/bind-with-user/{userId}": {
        "put": {
          "operationId": "SuperAdminBlogsController_bindBlogWithUser",
          "summary": "SA can bind blog (without owner) with blogger",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Blog was bind"
            },
            "400": {
              "description": "If incorrect URI param or Blog already bind with blogger",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "SuperAdmin Blogs"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/hometask_30/api/sa/blogs": {
        "get": {
          "operationId": "SuperAdminBlogsController_getBlogs",
          "summary": "SA can get all blogs",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show blogs with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show blogs with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show blogs with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting blogs by param (default: createdAt)",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "description": "Find term in blog's name (default: null)",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Blogs info was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_SuperAdminBlogViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "SuperAdmin Blogs"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/hometask_30/api/auth/registration": {
        "post": {
          "operationId": "AuthController_registration",
          "summary": "Registration in the system",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "User was added to platform. Email with confirm was sent to user"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 request from one ip in 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/hometask_30/api/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_resendEmailConfirm",
          "summary": "Resend email with confirm code to user. Confirm code inside link",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationEmailResending"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email with confirm was sent to user"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 request from one ip in 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/hometask_30/api/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_confirmEmail",
          "summary": "Confirm email to user",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationConfirmationCodeModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email was confirmed"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 request from one ip in 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/hometask_30/api/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "summary": "User can login into platform",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginInputModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Return Access token in body and Refresh token in Cookie",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/LoginSuccessViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Incorrect login or password"
            },
            "429": {
              "description": "More than 5 request from one ip in 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/hometask_30/api/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refreshTokens",
          "summary": "User can get new Access and Refresh tokens",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Return Access token in body and Refresh token in Cookie",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/LoginSuccessViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Incorrect Refresh token (missing, expired or incorrect)"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/hometask_30/api/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "summary": "User can logout (Access and Refresh tokens will be revoked)",
          "parameters": [],
          "responses": {
            "204": {
              "description": "Access and Refresh tokens will be revoked"
            },
            "401": {
              "description": "Incorrect Refresh token (missing, expired or incorrect)"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/hometask_30/api/auth/me": {
        "get": {
          "operationId": "AuthController_getMyInfo",
          "summary": "User can get info about own profile",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Return info about user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MeViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_sendPassRecoveryCode",
          "summary": "User can send request to set new password",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PasswordRecoveryInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "If email is exist email with confirmation was sent. If not just return 204"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 request from one ip in 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/hometask_30/api/auth/new-password": {
        "post": {
          "operationId": "AuthController_setNewPassword",
          "summary": "User can set new password, use confirmation",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordRecoveryInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "New password was set"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 request from one ip in 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/hometask_30/api/sa/users/{id}/ban": {
        "put": {
          "operationId": "UsersSAController_setBanStatus",
          "summary": "SA can ban/unban user",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BanUserInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "User was banned/unbanned"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "SuperAdmin Users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/sa/users": {
        "get": {
          "operationId": "UsersSAController_getUsers",
          "summary": "Return all users",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show users with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show users with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show users with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting users by param (default: createdAt)",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchEmailTerm",
              "required": false,
              "in": "query",
              "description": "Find term in user's email (default: null)",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "description": "Find term in user's login (default: null)",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Users was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_SAUserViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "SuperAdmin Users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "post": {
          "operationId": "UsersSAController_createUser",
          "summary": "SA can add user",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "User was created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SAUserViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "SuperAdmin Users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/sa/users/{id}": {
        "delete": {
          "operationId": "UsersSAController_deleteUser",
          "summary": "SA can delete user",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "User was deleted"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "User was not found"
            }
          },
          "tags": [
            "SuperAdmin Users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/blogger/users/{id}/ban": {
        "put": {
          "operationId": "UsersBloggerController_setBanStatusByBlogger",
          "summary": "Bun/unban user by blogger",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BloggerBanUserInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "User was banned/unbanned"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogger Users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/blogger/users/blog/{blogId}": {
        "get": {
          "operationId": "UsersBloggerController_getBlogsBannedUsers",
          "summary": "Return all banned users for blog",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show users with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show users with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show users with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting users by param (default: createdAt)",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "description": "Find term in user's login (default: null)",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Banned users was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_BloggerUserViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Blogger Users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/security/devices": {
        "get": {
          "operationId": "SecurityController_getDevices",
          "summary": "Return all user's sessions (by Refresh token)",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Session was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_DeviceViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Devices"
          ]
        },
        "delete": {
          "operationId": "SecurityController_deleteNonCurrentDevices",
          "summary": "Delete all user's sessions without current (by Refresh token)",
          "parameters": [],
          "responses": {
            "204": {
              "description": "Sessions was deleted"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Devices"
          ]
        }
      },
      "/hometask_30/api/security/devices/{id}": {
        "delete": {
          "operationId": "SecurityController_deleteDevice",
          "summary": "Delete current session by deviceId (by Refresh token)",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Session was deleted"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "User try to delete not own device"
            },
            "404": {
              "description": "Device was not found"
            }
          },
          "tags": [
            "Devices"
          ]
        }
      },
      "/hometask_30/api/posts/{id}/like-status": {
        "put": {
          "operationId": "PostsController_changeLikeStatus",
          "summary": "User can set/unset like/dislike for post",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LikeInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Like status for post was changed"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Post was not found"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/posts/{id}/comments": {
        "post": {
          "operationId": "PostsController_createPostsComment",
          "summary": "User can add comment for post",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Comment for post was added",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Post was not found"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "PostsController_getPostsComments",
          "summary": "Return all comments for post with paging",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show comments with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show comments with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show comments with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting comments by param (default: createdAt)",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Comments for post was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_CommentViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Post was not found"
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/hometask_30/api/posts": {
        "get": {
          "operationId": "PostsController_getPosts",
          "summary": "Return all posts with paging",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show posts with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show posts with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show posts with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting posts by param (default: createdAt)",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Posts was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_PostViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/hometask_30/api/posts/{id}": {
        "get": {
          "operationId": "PostsController_getPost",
          "summary": "Return post by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Post was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Post was not found"
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/hometask_30/api/comments/{id}/like-status": {
        "put": {
          "operationId": "CommentsController_changeLikeStatus",
          "summary": "User can set/unset like/dislike",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LikeInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Comment like status was updated"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Comment was not found"
            }
          },
          "tags": [
            "Comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/comments/{id}": {
        "put": {
          "operationId": "CommentsController_updateComment",
          "summary": "User can update own comment",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Comment was updated"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "User try to manipulate with not own comment"
            },
            "404": {
              "description": "Comment was not found"
            }
          },
          "tags": [
            "Comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "CommentsController_deleteComment",
          "summary": "User can delete own comment",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Comment was deleted"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "User try to manipulate with not own comment"
            },
            "404": {
              "description": "Comment was not found"
            }
          },
          "tags": [
            "Comments"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "CommentsController_getComment",
          "summary": "Returned comment by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Comment was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentViewModel"
                  }
                }
              }
            },
            "404": {
              "description": "Comment was not found"
            }
          },
          "tags": [
            "Comments"
          ]
        }
      },
      "/hometask_30/api/sa/quiz/questions": {
        "get": {
          "operationId": "QuizSAController_getQuestions",
          "summary": "Return all question with paging",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show questions with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show questions with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show questions with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting questions by param (default: createdAt)",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "bodySearchTerm",
              "required": false,
              "in": "query",
              "description": "Find term in question's name (default: null)",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "publishedStatus",
              "required": false,
              "in": "query",
              "description": "Filter by question's published status (default: all)",
              "schema": {
                "enum": [
                  "all",
                  "published",
                  "notPublished"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Questions was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_SAQuestionViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "QuizQuestions"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "post": {
          "operationId": "QuizSAController_createQuestion",
          "summary": "Create question",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionInputModel"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Question was created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SAQuestionViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "QuizQuestions"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/hometask_30/api/sa/quiz/questions/{id}": {
        "get": {
          "operationId": "QuizSAController_getQuestion",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "QuizQuestions"
          ]
        },
        "delete": {
          "operationId": "QuizSAController_deleteQuestion",
          "summary": "Delete question",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Question was deleted"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Question was not found"
            }
          },
          "tags": [
            "QuizQuestions"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "put": {
          "operationId": "QuizSAController_updateQuestion",
          "summary": "Update question",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Question was updated"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Question was not found"
            }
          },
          "tags": [
            "QuizQuestions"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/hometask_30/api/sa/quiz/questions/{id}/publish": {
        "put": {
          "operationId": "QuizSAController_publishQuestion",
          "summary": "Change publish status",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PublishInputModel"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Publish status was updated"
            },
            "400": {
              "description": "Request body has error(s)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "QuizQuestions"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/hometask_30/api/pair-game-quiz/users/top": {
        "get": {
          "operationId": "QuizController_getTopUsers",
          "summary": "Get users top",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show games with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show games with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sort",
              "required": false,
              "in": "query",
              "description": "Sort param (default: ?sort=avgScores desc&sort=sumScore desc)",
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Top was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_TopUserViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "PairQuizGame"
          ]
        }
      },
      "/hometask_30/api/pair-game-quiz/users/my-statistic": {
        "get": {
          "operationId": "QuizController_getMyStatistic",
          "summary": "Return user's game statistic",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Statistic was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MyStatisticViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/pair-game-quiz/pairs/my": {
        "get": {
          "operationId": "QuizController_getMyGames",
          "summary": "Return all user's games",
          "parameters": [
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Show games with pass pageSize (default: 10)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Show games with pass pageNumber (default: 1)",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "description": "Show games with sortDirection (default: desc)",
              "schema": {
                "enum": [
                  "acs",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Sorting games by param (default: pairCreatedDate)",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Games was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/sw_Paginator_GamePairViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/pair-game-quiz/pairs/my-current": {
        "get": {
          "operationId": "QuizController_getCurrentGame",
          "summary": "Return current unfinished user game",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Game was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GamePairViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Game not found"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/pair-game-quiz/pairs/{id}": {
        "get": {
          "operationId": "QuizController_getGameById",
          "summary": "Return game by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Game was returned",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GamePairViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Param has error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If current user tries to get pair in which user is not participant"
            },
            "404": {
              "description": "Game not found"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/pair-game-quiz/pairs/connection": {
        "post": {
          "operationId": "QuizController_connectToGame",
          "summary": "Connect user to game or create new game",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Return exist or new game",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GamePairViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If current user is already participating in active pair"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/pair-game-quiz/pairs/my-current/answers": {
        "post": {
          "operationId": "QuizController_sendAnswer",
          "summary": "Send next answer in active game",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AnswerInputModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Return answer result",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AnswerViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If current user is already participating in active pair"
            }
          },
          "tags": [
            "PairQuizGame"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/hometask_30/api/integrations/telegram/webhook": {
        "post": {
          "operationId": "IntegrationsController_setWebhook",
          "summary": "Webhook for telegram bot api",
          "parameters": [],
          "responses": {
            "204": {
              "description": "Webhook was set"
            }
          },
          "tags": [
            "Integrations"
          ]
        }
      },
      "/hometask_30/api/integrations/telegram/auth-bot-link": {
        "get": {
          "operationId": "IntegrationsController_getTelegramLink",
          "summary": "Get auth bot link with personal user code inside",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Link was send",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GetMyTgAuthViewModel"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Integrations"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      }
    },
    "info": {
      "title": "Blogger Platform API",
      "description": "Blogger Platform API.\nBase URL is https://post-and-blog-platform-on-nest.vercel.app",
      "version": "23",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        },
        "cookie": {
          "type": "apiKey",
          "in": "cookie",
          "name": "refreshToken"
        },
        "basic": {
          "type": "http",
          "scheme": "basic"
        }
      },
      "schemas": {
        "UserTestViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "User's id",
              "nullable": false,
              "example": "e5713a0d-8d9f-4716-864b-5015daf2df07"
            },
            "login": {
              "type": "string",
              "description": "User's login",
              "nullable": false,
              "example": "eja777one"
            },
            "email": {
              "type": "string",
              "description": "User's email",
              "nullable": false,
              "example": "eja777one@gmail.com"
            },
            "createdAt": {
              "type": "string",
              "description": "User's created at date",
              "nullable": false,
              "example": "2023-05-16T12:40:55.662Z"
            },
            "confirmationCode": {
              "type": "string",
              "description": "User's confirmation",
              "nullable": false,
              "example": "088a68e7-3e3f-46d8-8c8f-7c87f9b9341d"
            },
            "expirationDate": {
              "type": "string",
              "description": "User's confirmation expiration date",
              "nullable": false,
              "example": "2023-05-16T12:40:55.662Z"
            },
            "isConfirmed": {
              "type": "boolean",
              "description": "User's confirmation status",
              "nullable": false,
              "example": true
            },
            "sentEmailsCount": {
              "type": "number",
              "description": "User's confirmation mails count",
              "nullable": false,
              "example": 3
            }
          },
          "required": [
            "id",
            "login",
            "email",
            "createdAt",
            "confirmationCode",
            "expirationDate",
            "isConfirmed",
            "sentEmailsCount"
          ]
        },
        "DeviceViewModel": {
          "type": "object",
          "properties": {
            "ip": {
              "type": "string",
              "description": "Device's ip",
              "nullable": false,
              "example": "26.163.103.234"
            },
            "title": {
              "type": "string",
              "description": "Device's title",
              "nullable": false,
              "example": "Chrome"
            },
            "lastActiveDate": {
              "type": "string",
              "description": "Device's last log in",
              "nullable": false,
              "example": "2023-05-16T11:46:36.006Z"
            },
            "deviceId": {
              "type": "string",
              "description": "Device's id",
              "nullable": false,
              "example": "58a74f93-d443-4203-9889-05098d96b6a3"
            }
          },
          "required": [
            "ip",
            "title",
            "lastActiveDate",
            "deviceId"
          ]
        },
        "PassRecTestViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "RecCode's id",
              "nullable": false,
              "example": "e5713a0d-8d9f-4716-864b-5015daf2df07"
            },
            "userId": {
              "type": "string",
              "description": "User's id",
              "nullable": false,
              "example": "49a71dc8-a8b0-416f-8154-cadd4302fc2e"
            },
            "passwordRecoveryCode": {
              "type": "string",
              "description": "RecCode's code",
              "nullable": false,
              "example": "07a34d92-69e8-49d3-b29c-caaf1911ea21"
            },
            "createdAt": {
              "type": "string",
              "description": "RecCode's created at date",
              "nullable": false,
              "example": "2023-05-14T17:00:08.317Z"
            },
            "expiredAt": {
              "type": "string",
              "description": "RecCode's expired at date",
              "nullable": false,
              "example": "2023-05-14T17:00:08.317Z"
            }
          },
          "required": [
            "id",
            "userId",
            "passwordRecoveryCode",
            "createdAt",
            "expiredAt"
          ]
        },
        "PhotoSizeViewModel": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "Wallpaper URL",
              "nullable": false,
              "example": "/...."
            },
            "width": {
              "type": "number",
              "description": "Wallpaper width in px. Must be 1028",
              "nullable": false,
              "example": 0
            },
            "height": {
              "type": "number",
              "description": "Wallpaper height in px. Must be 312",
              "nullable": false,
              "example": 0
            },
            "fileSize": {
              "type": "number",
              "description": "Wallpaper size. Max file size 100KB",
              "nullable": false,
              "example": 100
            }
          },
          "required": [
            "url",
            "width",
            "height",
            "fileSize"
          ]
        },
        "BlogsImagesViewModel": {
          "type": "object",
          "properties": {
            "wallpaper": {
              "description": "Wallpaper info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/PhotoSizeViewModel"
                }
              ]
            },
            "main": {
              "description": "Wallpapers array",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PhotoSizeViewModel"
              }
            }
          },
          "required": [
            "wallpaper",
            "main"
          ]
        },
        "BlogViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Blog's id",
              "nullable": false,
              "example": "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
            },
            "name": {
              "type": "string",
              "description": "Blog's name",
              "nullable": false,
              "example": "Blog #1"
            },
            "description": {
              "type": "string",
              "description": "Blog's description",
              "nullable": false,
              "example": "Blog #1 - is best blog in the World!"
            },
            "websiteUrl": {
              "type": "string",
              "description": "Blog's websiteUrl",
              "nullable": false,
              "example": "https://blogNumberOne.com"
            },
            "createdAt": {
              "type": "string",
              "description": "Blog's created date",
              "nullable": false,
              "example": "2023-05-14T17:00:08.317Z"
            },
            "isMembership": {
              "type": "boolean",
              "description": "Some value (archive)",
              "nullable": false,
              "example": "false"
            },
            "images": {
              "description": "Blog's images info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/BlogsImagesViewModel"
                }
              ]
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "websiteUrl",
            "createdAt",
            "isMembership",
            "images"
          ]
        },
        "sw_Paginator_BlogViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BlogViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "LikeDetailsViewModel": {
          "type": "object",
          "properties": {
            "addedAt": {
              "type": "string",
              "description": "Like's added date",
              "nullable": false,
              "example": "2023-05-14T17:30:29.279Z"
            },
            "userId": {
              "type": "string",
              "description": "Like's owner id",
              "nullable": false,
              "example": "ffe00bba-ac51-4530-8a7b-2f42165ba3b9"
            },
            "login": {
              "type": "string",
              "description": "Like's owner login",
              "nullable": false,
              "example": "Blogger #1"
            }
          },
          "required": [
            "addedAt",
            "userId",
            "login"
          ]
        },
        "ExtendedLikesInfoViewModel": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number",
              "description": "Post's likesCount",
              "nullable": false,
              "example": 0
            },
            "dislikesCount": {
              "type": "number",
              "description": "Post's dislikesCount",
              "nullable": false,
              "example": 0
            },
            "myStatus": {
              "type": "string",
              "description": "Post's likeStatus for current user",
              "nullable": false,
              "example": "Like"
            },
            "newestLikes": {
              "description": "Post's newestLikes",
              "nullable": true,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/LikeDetailsViewModel"
              }
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus",
            "newestLikes"
          ]
        },
        "PostImagesViewModel": {
          "type": "object",
          "properties": {
            "main": {
              "description": "Must contain original photo size (940x432) and middle photo (300x180) and small (149x96)",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PhotoSizeViewModel"
              }
            }
          },
          "required": [
            "main"
          ]
        },
        "PostViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Post's id",
              "nullable": false,
              "example": "8918e471-f05d-457f-932c-e7cc2e9c7d42"
            },
            "title": {
              "type": "string",
              "description": "Post's title",
              "nullable": false,
              "example": "My Post #1"
            },
            "shortDescription": {
              "type": "string",
              "description": "Post's shortDescription",
              "nullable": false,
              "example": "My Post #1 for Blog #1"
            },
            "content": {
              "type": "string",
              "description": "Post's content",
              "nullable": false,
              "example": "I waste a lot of time to write this Post #1 for Blog #1. So it is perfect!"
            },
            "blogId": {
              "type": "string",
              "description": "Blog's id",
              "nullable": false,
              "example": "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
            },
            "blogName": {
              "type": "string",
              "description": "Blog's name",
              "nullable": false,
              "example": "Blog #1"
            },
            "createdAt": {
              "type": "string",
              "description": "Post's created date",
              "nullable": false,
              "example": "2023-05-14T17:00:08.317Z"
            },
            "extendedLikesInfo": {
              "description": "Post's likes info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/ExtendedLikesInfoViewModel"
                }
              ]
            },
            "images": {
              "description": "Post's images info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/PostImagesViewModel"
                }
              ]
            }
          },
          "required": [
            "id",
            "title",
            "shortDescription",
            "content",
            "blogId",
            "blogName",
            "createdAt",
            "extendedLikesInfo",
            "images"
          ]
        },
        "sw_Paginator_PostViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PostViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "BlogInputModel": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Blog's name",
              "nullable": false,
              "minLength": 1,
              "maxLength": 15,
              "example": "Blog #1"
            },
            "description": {
              "type": "string",
              "description": "Blog's description",
              "nullable": false,
              "minLength": 1,
              "maxLength": 500,
              "example": "Blog #1 - is best blog in the World!"
            },
            "websiteUrl": {
              "type": "string",
              "description": "Blog's websiteUrl",
              "nullable": false,
              "minLength": 1,
              "maxLength": 100,
              "example": "https://blogNumberOne.com"
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "FieldError": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "Message with error",
              "nullable": true,
              "example": "Incorrect email"
            },
            "field": {
              "type": "string",
              "description": "Field with error",
              "nullable": true,
              "example": "email"
            }
          },
          "required": [
            "message",
            "field"
          ]
        },
        "APIErrorResult": {
          "type": "object",
          "properties": {
            "errorsMessages": {
              "nullable": true,
              "allOf": [
                {
                  "$ref": "#/components/schemas/FieldError"
                }
              ]
            }
          },
          "required": [
            "errorsMessages"
          ]
        },
        "PostInputModelNoId": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Post's title",
              "nullable": false,
              "minLength": 1,
              "maxLength": 30,
              "example": "Post #1"
            },
            "shortDescription": {
              "type": "string",
              "description": "Post's shortDescription",
              "nullable": false,
              "minLength": 1,
              "maxLength": 100,
              "example": "Post #1 for Blog #1"
            },
            "content": {
              "type": "string",
              "description": "Post's content",
              "nullable": false,
              "minLength": 1,
              "maxLength": 1000,
              "example": "I waste a lot of time to write this Post #1 for Blog #1. So it is perfect!"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content"
          ]
        },
        "CommentatorInfo": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "description": "User's id",
              "nullable": false,
              "example": "05468353-3877-49e2-80db-160f82c7a0eb"
            },
            "userLogin": {
              "type": "string",
              "description": "User's login",
              "nullable": false,
              "example": "eja777one"
            }
          },
          "required": [
            "userId",
            "userLogin"
          ]
        },
        "LikesInfoViewModel": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number",
              "description": "Likes count",
              "nullable": false,
              "example": 0
            },
            "dislikesCount": {
              "type": "number",
              "description": "Dislikes count",
              "nullable": false,
              "example": 0
            },
            "myStatus": {
              "type": "string",
              "description": "My like status",
              "nullable": false,
              "example": "None"
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus"
          ]
        },
        "PostInfo": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Post's id",
              "nullable": false,
              "example": "8918e471-f05d-457f-932c-e7cc2e9c7d42"
            },
            "title": {
              "type": "string",
              "description": "Post's title",
              "nullable": false,
              "example": "My Post #1"
            },
            "blogId": {
              "type": "string",
              "description": "Blog's id",
              "nullable": false,
              "example": "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
            },
            "blogName": {
              "type": "string",
              "description": "Blog's name",
              "nullable": false,
              "example": "Blog #1"
            }
          },
          "required": [
            "id",
            "title",
            "blogId",
            "blogName"
          ]
        },
        "CommentWithPostViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Comment's id",
              "nullable": false,
              "example": "dcc34bb9-f6d9-4e04-b672-11647a57cdfb"
            },
            "content": {
              "type": "string",
              "description": "Comment's content",
              "nullable": false,
              "example": "It is really cool post! I recommend it to my friend"
            },
            "commentatorInfo": {
              "description": "Comment's owner info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/CommentatorInfo"
                }
              ]
            },
            "createdAt": {
              "type": "string",
              "description": "Comment's added date",
              "nullable": false,
              "example": "2023-05-16T05:19:17.757Z"
            },
            "likesInfo": {
              "description": "Comment's likes info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/LikesInfoViewModel"
                }
              ]
            },
            "postInfo": {
              "description": "Comment's likes info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/PostInfo"
                }
              ]
            }
          },
          "required": [
            "id",
            "content",
            "commentatorInfo",
            "createdAt",
            "likesInfo",
            "postInfo"
          ]
        },
        "sw_Paginator_CommentWithPostViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CommentWithPostViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "SaBanBlogInputModel": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "description": "If SA want to ban blog - true, else false",
              "nullable": false,
              "example": true
            }
          },
          "required": [
            "isBanned"
          ]
        },
        "BlogOwnerInfo": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "description": "User's id",
              "nullable": false,
              "example": "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
            },
            "userLogin": {
              "type": "string",
              "description": "User's login",
              "nullable": false,
              "example": "eja777one"
            }
          },
          "required": [
            "userId",
            "userLogin"
          ]
        },
        "BanInfo": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "description": "True - if blog is banned",
              "nullable": false,
              "example": false
            },
            "banDate": {
              "type": "string",
              "description": "Ban date - if blog is banned",
              "nullable": false,
              "example": "2023-05-14T17:00:08.317Z"
            }
          },
          "required": [
            "isBanned",
            "banDate"
          ]
        },
        "SuperAdminBlogViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Blog's id",
              "nullable": false,
              "example": "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
            },
            "name": {
              "type": "string",
              "description": "Blog's name",
              "nullable": false,
              "example": "Blog #1"
            },
            "description": {
              "type": "string",
              "description": "Blog's description",
              "nullable": false,
              "example": "Blog #1 - is best blog in the World!"
            },
            "websiteUrl": {
              "type": "string",
              "description": "Blog's websiteUrl",
              "nullable": false,
              "example": "https://blogNumberOne.com"
            },
            "createdAt": {
              "type": "string",
              "description": "Blog's created date",
              "nullable": false,
              "example": "2023-05-14T17:00:08.317Z"
            },
            "isMembership": {
              "type": "boolean",
              "description": "Some value (archive)",
              "nullable": false,
              "example": "false"
            },
            "blogOwnerInfo": {
              "description": "Blog's owner info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/BlogOwnerInfo"
                }
              ]
            },
            "banInfo": {
              "description": "Blog's ban info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/BanInfo"
                }
              ]
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "websiteUrl",
            "createdAt",
            "isMembership",
            "blogOwnerInfo",
            "banInfo"
          ]
        },
        "sw_Paginator_SuperAdminBlogViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/SuperAdminBlogViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "UserInputModel": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "description": "User's login",
              "nullable": false,
              "minLength": 3,
              "maxLength": 10,
              "example": "eja777one"
            },
            "password": {
              "type": "string",
              "description": "User's password",
              "nullable": false,
              "minLength": 6,
              "maxLength": 20,
              "example": "userPassword"
            },
            "email": {
              "type": "string",
              "description": "User's email",
              "nullable": false,
              "example": "eja777one@gmail.com"
            }
          },
          "required": [
            "login",
            "password",
            "email"
          ]
        },
        "RegistrationEmailResending": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "User's email",
              "nullable": false,
              "example": "eja777one@gmail.com"
            }
          },
          "required": [
            "email"
          ]
        },
        "RegistrationConfirmationCodeModel": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "Confirm code, which was sent to user",
              "nullable": false,
              "example": "b582d22c-aa63-4b67-be2f-bb7f3c2472c2"
            }
          },
          "required": [
            "code"
          ]
        },
        "LoginInputModel": {
          "type": "object",
          "properties": {
            "loginOrEmail": {
              "type": "string",
              "description": "User's email OR password",
              "nullable": false,
              "example": "eja777one@gmail.com"
            },
            "password": {
              "type": "string",
              "description": "User's password",
              "nullable": false,
              "minLength": 6,
              "maxLength": 20,
              "example": "userPassword"
            }
          },
          "required": [
            "loginOrEmail",
            "password"
          ]
        },
        "LoginSuccessViewModel": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string",
              "description": "Access token",
              "nullable": false,
              "example": "5394ce36-960c-4b6a-97b1-9ce929aa29a4"
            }
          },
          "required": [
            "accessToken"
          ]
        },
        "MeViewModel": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "nullable": false,
              "example": "eja777one@gmail.com"
            },
            "login": {
              "type": "string",
              "nullable": false,
              "example": "eja777one"
            },
            "userId": {
              "type": "string",
              "nullable": false,
              "example": "c966e677-4552-4fb3-8027-50200d4b6c2d"
            }
          },
          "required": [
            "email",
            "login",
            "userId"
          ]
        },
        "PasswordRecoveryInputModel": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "User's email",
              "nullable": false,
              "example": "eja777one@gmail.com"
            }
          },
          "required": [
            "email"
          ]
        },
        "NewPasswordRecoveryInputModel": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "description": "User's password",
              "nullable": false,
              "minLength": 6,
              "maxLength": 20,
              "example": "newUserPassword"
            },
            "recoveryCode": {
              "type": "string",
              "description": "User's confirmation",
              "nullable": false,
              "example": "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "BanUserInputModel": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "description": "True - if ban user, else false",
              "nullable": false,
              "example": true
            },
            "banReason": {
              "type": "string",
              "description": "Ban reason",
              "nullable": false,
              "minLength": 20,
              "example": "ban-reason-ban-reason-ban-reason-ban-reason"
            }
          },
          "required": [
            "isBanned",
            "banReason"
          ]
        },
        "SAUserViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "User's id",
              "nullable": false,
              "example": "e5713a0d-8d9f-4716-864b-5015daf2df07"
            },
            "login": {
              "type": "string",
              "description": "User's login",
              "nullable": false,
              "example": "eja777one"
            },
            "email": {
              "type": "string",
              "description": "User's email",
              "nullable": false,
              "example": "eja777one@gmail.com"
            },
            "createdAt": {
              "type": "string",
              "description": "User's created at date",
              "nullable": false,
              "example": "2023-05-16T12:40:55.662Z"
            },
            "banInfo": {
              "description": "User's ban info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/BanInfo"
                }
              ]
            }
          },
          "required": [
            "id",
            "login",
            "email",
            "createdAt",
            "banInfo"
          ]
        },
        "sw_Paginator_SAUserViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/SAUserViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "BloggerBanUserInputModel": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "description": "True - if ban user, else false",
              "nullable": false,
              "example": true
            },
            "banReason": {
              "type": "string",
              "description": "Ban reason",
              "nullable": false,
              "minLength": 20,
              "example": "ban-reason-ban-reason-ban-reason-ban-reason"
            },
            "blogId": {
              "type": "string",
              "description": "Blog's id",
              "nullable": false,
              "example": "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
            }
          },
          "required": [
            "isBanned",
            "banReason",
            "blogId"
          ]
        },
        "BloggerUserViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "User's id",
              "nullable": false,
              "example": "e5713a0d-8d9f-4716-864b-5015daf2df07"
            },
            "login": {
              "type": "string",
              "description": "User's login",
              "nullable": false,
              "example": "eja777one"
            },
            "banInfo": {
              "description": "User's ban info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/BanInfo"
                }
              ]
            }
          },
          "required": [
            "id",
            "login",
            "banInfo"
          ]
        },
        "sw_Paginator_BloggerUserViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BloggerUserViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "sw_Paginator_DeviceViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/DeviceViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "LikeInputModel": {
          "type": "object",
          "properties": {
            "likeStatus": {
              "type": "string",
              "description": "LikeStatus (Like, Dislike, None)",
              "nullable": false,
              "example": "Like"
            }
          },
          "required": [
            "likeStatus"
          ]
        },
        "CommentInputModel": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "Comment's content",
              "minLength": 20,
              "maxLength": 300,
              "nullable": false,
              "example": "It is really cool post! I recommend it to my friend"
            }
          },
          "required": [
            "content"
          ]
        },
        "CommentViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Comment's id",
              "nullable": false,
              "example": "dcc34bb9-f6d9-4e04-b672-11647a57cdfb"
            },
            "content": {
              "type": "string",
              "description": "Comment's content",
              "nullable": false,
              "example": "It is really cool post! I recommend it to my friend"
            },
            "commentatorInfo": {
              "description": "Comment's owner info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/CommentatorInfo"
                }
              ]
            },
            "createdAt": {
              "type": "string",
              "description": "Comment's added date",
              "nullable": false,
              "example": "2023-05-16T05:19:17.757Z"
            },
            "likesInfo": {
              "description": "Comment's likes info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/LikesInfoViewModel"
                }
              ]
            }
          },
          "required": [
            "id",
            "content",
            "commentatorInfo",
            "createdAt",
            "likesInfo"
          ]
        },
        "sw_Paginator_CommentViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CommentViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "SAQuestionViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Question's id",
              "nullable": false,
              "example": "9627e52f-7246-4299-823c-2784537a6430"
            },
            "body": {
              "type": "string",
              "description": "Question's body",
              "nullable": false,
              "example": "How many hands mans have?"
            },
            "correctAnswers": {
              "description": "Question's correct answers",
              "nullable": false,
              "example": [
                "Two",
                "2",
                "One pair"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "published": {
              "type": "boolean",
              "description": "Question's published status",
              "nullable": false,
              "example": false
            },
            "createdAt": {
              "type": "string",
              "description": "Question's created at date",
              "nullable": false,
              "example": "2023-05-16T10:30:54.443Z"
            },
            "updatedAt": {
              "type": "string",
              "description": "Question's updated at date",
              "nullable": false,
              "example": "2023-05-16T10:30:54.443Z"
            }
          },
          "required": [
            "id",
            "body",
            "correctAnswers",
            "published",
            "createdAt",
            "updatedAt"
          ]
        },
        "sw_Paginator_SAQuestionViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/SAQuestionViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "QuestionInputModel": {
          "type": "object",
          "properties": {
            "body": {
              "type": "string",
              "description": "Question's body",
              "nullable": false,
              "minLength": 10,
              "maxLength": 500,
              "example": "How many hands mans have?"
            },
            "correctAnswers": {
              "description": "Question's correct answers",
              "nullable": false,
              "example": [
                "Two",
                "2",
                "One pair"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "body",
            "correctAnswers"
          ]
        },
        "PublishInputModel": {
          "type": "object",
          "properties": {
            "published": {
              "type": "boolean",
              "description": "Question's published status",
              "nullable": false,
              "example": true
            }
          },
          "required": [
            "published"
          ]
        },
        "Player": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Player's info",
              "nullable": false,
              "example": "f0da849d-4ff9-4d36-905c-9e8eb3d7a3c3"
            },
            "login": {
              "type": "string",
              "description": "Player's login",
              "nullable": false,
              "example": "eja777one"
            }
          },
          "required": [
            "id",
            "login"
          ]
        },
        "TopUserViewModel": {
          "type": "object",
          "properties": {
            "sumScore": {
              "type": "number",
              "description": "Sum scores of all games",
              "nullable": false,
              "example": 4
            },
            "avgScores": {
              "type": "number",
              "description": "Average score of all games rounded to 2 decimal places",
              "nullable": false,
              "example": 1.33
            },
            "gamesCount": {
              "type": "number",
              "description": "All played games count",
              "nullable": false,
              "example": 3
            },
            "winsCount": {
              "type": "number",
              "description": "winsCount",
              "nullable": false,
              "example": 1
            },
            "lossesCount": {
              "type": "number",
              "description": "lossesCount",
              "nullable": false,
              "example": 2
            },
            "drawsCount": {
              "type": "number",
              "description": "drawsCount",
              "nullable": false,
              "example": 0
            },
            "player": {
              "description": "player",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/Player"
                }
              ]
            }
          },
          "required": [
            "sumScore",
            "avgScores",
            "gamesCount",
            "winsCount",
            "lossesCount",
            "drawsCount",
            "player"
          ]
        },
        "sw_Paginator_TopUserViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TopUserViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "MyStatisticViewModel": {
          "type": "object",
          "properties": {
            "sumScore": {
              "type": "number",
              "description": "Sum scores of all games",
              "nullable": false,
              "example": 4
            },
            "avgScores": {
              "type": "number",
              "description": "Average score of all games rounded to 2 decimal places",
              "nullable": false,
              "example": 1.33
            },
            "gamesCount": {
              "type": "number",
              "description": "All played games count",
              "nullable": false,
              "example": 3
            },
            "winsCount": {
              "type": "number",
              "description": "winsCount",
              "nullable": false,
              "example": 1
            },
            "lossesCount": {
              "type": "number",
              "description": "lossesCount",
              "nullable": false,
              "example": 2
            },
            "drawsCount": {
              "type": "number",
              "description": "drawsCount",
              "nullable": false,
              "example": 0
            }
          },
          "required": [
            "sumScore",
            "avgScores",
            "gamesCount",
            "winsCount",
            "lossesCount",
            "drawsCount"
          ]
        },
        "AnswerViewModel": {
          "type": "object",
          "properties": {
            "questionId": {
              "type": "string",
              "description": "Question's id",
              "nullable": false,
              "example": "9627e52f-7246-4299-823c-2784537a6430"
            },
            "answerStatus": {
              "type": "string",
              "description": "Question's answerStatus",
              "nullable": false,
              "example": "Correct"
            },
            "addedAt": {
              "type": "string",
              "description": "Answer's added at date ",
              "nullable": false,
              "example": "2023-05-16T10:30:54.443Z"
            }
          },
          "required": [
            "questionId",
            "answerStatus",
            "addedAt"
          ]
        },
        "GamePlayerProgressViewModel": {
          "type": "object",
          "properties": {
            "answers": {
              "description": "Player's answers",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/AnswerViewModel"
              }
            },
            "player": {
              "description": "Player's info",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/Player"
                }
              ]
            },
            "score": {
              "type": "number",
              "description": "Player's score",
              "nullable": false,
              "example": 0
            }
          },
          "required": [
            "answers",
            "player",
            "score"
          ]
        },
        "QuestionViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Question's id",
              "nullable": false,
              "example": "35292742-e397-4db4-9318-c5d866ada2ed"
            },
            "body": {
              "type": "string",
              "description": "Question's body",
              "nullable": false,
              "example": "How many hands mans have?"
            }
          },
          "required": [
            "id",
            "body"
          ]
        },
        "GamePairViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Game pair id",
              "nullable": false,
              "example": "68572be5-becc-4f87-8644-8e63f06927cf"
            },
            "firstPlayerProgress": {
              "description": "First player progress",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/GamePlayerProgressViewModel"
                }
              ]
            },
            "secondPlayerProgress": {
              "description": "Second player progress",
              "nullable": false,
              "allOf": [
                {
                  "$ref": "#/components/schemas/GamePlayerProgressViewModel"
                }
              ]
            },
            "questions": {
              "description": "Game's questions",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/QuestionViewModel"
              }
            },
            "status": {
              "type": "string",
              "description": "Game's status",
              "nullable": false,
              "example": "Active"
            },
            "pairCreatedDate": {
              "type": "string",
              "description": "Game's created date (when first player connect)",
              "nullable": false,
              "example": "2023-05-17T04:35:34.471Z"
            },
            "startGameDate": {
              "type": "string",
              "description": "Game's started date (when second player connect)",
              "nullable": true,
              "example": "2023-05-17T04:35:34.471Z"
            },
            "finishGameDate": {
              "type": "string",
              "description": "Game's finished date (when all players answered all questions)",
              "nullable": true,
              "example": "2023-05-17T04:35:34.471Z"
            }
          },
          "required": [
            "id",
            "firstPlayerProgress",
            "secondPlayerProgress",
            "questions",
            "status",
            "pairCreatedDate",
            "startGameDate",
            "finishGameDate"
          ]
        },
        "sw_Paginator_GamePairViewModel": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Pages count",
              "nullable": false,
              "example": 1
            },
            "page": {
              "type": "number",
              "description": "Page number",
              "nullable": false,
              "example": 1
            },
            "pageSize": {
              "type": "number",
              "description": "Page size",
              "nullable": false,
              "example": 1
            },
            "totalCount": {
              "type": "number",
              "description": "Total count",
              "nullable": false,
              "example": 1
            },
            "items": {
              "description": "Items",
              "nullable": false,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/GamePairViewModel"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "AnswerInputModel": {
          "type": "object",
          "properties": {
            "answer": {
              "type": "string",
              "description": "User's answer",
              "nullable": false,
              "example": "Two"
            }
          },
          "required": [
            "answer"
          ]
        },
        "GetMyTgAuthViewModel": {
          "type": "object",
          "properties": {
            "link": {
              "type": "string",
              "description": "Link to tg bot with code as query param",
              "nullable": false,
              "example": "https://t.me/blogger_platform_bot?code=123"
            }
          },
          "required": [
            "link"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
