const defaultPermissions = require("./defaultPermission.json");

export default function defaultRoles() {
    const ROLES = [
        {
            name: 'Super Admin',
            permissions: [
                "admin.companies",
                "admin.companies.updateStatus",
                "admin.companies.invite",
                "admin.companies.deleteCompany",
                "admin.companies.updateCompanyInfo",
                "admin.companies.company",
                "auth.user.updateMe",
                "companies.company.users",
                "companies.company.updateUserStatus",
                "companies.company.deleteUser",
                "companies.company.inviteUser",
                "companies.company.createDepartment",
                "companies.company.updateDepartment",
                "companies.company.getDepartment",
                "companies.company.getAllDepartments",
                "companies.company.deleteDepartment",
                "companies.company.updateCompanyBasicInfoSelf",

            ]

        },
        {
            name: "Admin",
            permissions: [

                "auth.user.updateMe",
                "companies.company.users",
                "companies.company.updateUserStatus",
                "companies.company.inviteUser",
                "companies.company.createDepartment",
                "companies.company.updateDepartment",
                "companies.company.getDepartment",
                "companies.company.getAllDepartments",
                "companies.company.deleteDepartment",
                "company.deleteUser",
                "companies.company.updateCompanyBasicInfoSelf",
            ]
        },
        {
            name: "Manager",
            permissions: ["auth.user.updateMe","companies.company.users","companies.company.getAllDepartments"]
        }




    ];

    return [

        ...ROLES.map(e => ({
            type: e.name,
            permissions: defaultPermissions.map(z => (e.permissions.includes(z.bk_can) ? z.bk_can : null)).filter(x => x !== null),
        })),
    ];
}
