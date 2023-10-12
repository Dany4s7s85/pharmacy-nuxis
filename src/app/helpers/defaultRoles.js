const defaultPermissions = require('./defaultPermission.json');

export default function defaultRoles() {
  const ROLES = [
    {
      name: 'pharmacist',
      permissions: [
                'pharmacies.nav',
                 'pharmacies.addPharmacy',
                 'pharmacies.pharmacyDetail',
                  'members.nav',
                 'members.addMember',
                  'members.memberDetail',
                  'members.updateMember',
                  'orders.nav',
                   'subOrder.subOrderDetail',
                   'subOrder.dropdown',
                   'purchaseOrders.nav',
                    'pharmacy_profile.nav',
                    'pharmacy_profile.updateProfile',
                   'profile.nav',
                   'dashboard.nav',
                   'pharmacy.purchasing'
      ],
    },
    {
      name: 'technician',
      permissions: [
        'pharmacies.nav',
        'pharmacies.addPharmacy',
        'pharmacies.pharmacyDetail',
        'members.nav',
        'orders.nav',
        'subOrder.subOrderDetail',
        'subOrder.dropdown',
        'purchaseOrders.nav',
        'pharmacy_profile.nav',
        'pharmacy_profile.updateProfile',
        'profile.nav',
        'dashboard.nav',

      ],
    },
  ];

  return [
    {
      type: 'super_admin',
      permissions: defaultPermissions,
    },

    ...ROLES.map(e => ({
      type: e.name,
      permissions: defaultPermissions.map(z => (e.permissions.includes(z.can) ? z : null)).filter(x => x !== null),
    })),
  ];
}
