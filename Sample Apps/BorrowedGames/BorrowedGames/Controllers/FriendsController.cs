﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BorrowedGames.Models;

namespace BorrowedGames.Controllers
{
    public class FriendsController : BaseController
    {
        [HttpPost]
        public dynamic Follow(string handle)
        {
            var friend = users.ForHandle(handle);

            if (friend == null) return Json(new { Message = "User with handle " + handle + " doesn't exist.", Added = false });

            if (Friends().Any(s => s.Handle == handle)) return Json(new { Message = "You are already following " + handle + ".", Added = false });

            users.Single(CurrentUser).AddFriend(friend);

            return Json(new { Message = "You are now following " + handle + ".", Added = true });
        }

        [HttpPost]
        public dynamic Unfollow(string handle)
        {
            users.Single(CurrentUser).RemoveFriend(users.ForHandle(handle));

            return new EmptyResult();
        }

        public dynamic List()
        {
            return Json(Friends().Select(s => s.Handle as string));
        }

        IEnumerable<dynamic> Friends()
        {
            return users.Single(CurrentUser).Friends();
        }
    }
}
