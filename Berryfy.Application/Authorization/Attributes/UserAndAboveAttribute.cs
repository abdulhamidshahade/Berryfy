using Berryfy.Domain.Constants;

namespace Berryfy.Application.Authorization.Attributes
{
    public class UserAndAboveAttribute
    {
        public UserAndAboveAttribute() : base(RoleConstants.SuperAdmin, RoleConstants.Admin, RoleConstants.User) { }
    }
}
