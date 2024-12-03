import type { Response } from "src/config/Constants";
import { userDataForm } from "src/redux/reducer/admin/Types";

export type resFetchGetListUserFromAdmin = Response<{
    list: userDataForm[];
}>;

export type resAddUserFromAdmin = Response<{
    newUser: userDataForm;
}>;

export type resUpdateUserFromAdmin = Response<{
    updatedUser: userDataForm;
}>;

export type resDeletedUserFromAdmin = Response<{
    deletedUser: userDataForm;
}>;
