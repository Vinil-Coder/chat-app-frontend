export const WORK_SPACES = [
  { workspace_id: 1, user_id: 1, name: 'General' },
  { workspace_id: 2, user_id: 2, name: 'Marketing' },
  { workspace_id: 3, user_id: 3, name: 'Dev Team' },
  { workspace_id: 4, user_id: 1, name: 'Design Studio' },
  { workspace_id: 5, user_id: 2, name: 'HR Hub' },
  { workspace_id: 6, user_id: 3, name: 'Product Team' },
  { workspace_id: 7, user_id: 4, name: 'Sales Squad' },
  { workspace_id: 8, user_id: 5, name: 'Finance Ops' }
];

export const MEMBERS = [
  {
    workspace_id: 1,
    users: [
      { user_id: 1, name: 'John Doe', email: 'john@demo.com', role: 'Admin', status: 'Invited', contact: '9876543210' },
      { user_id: 2, name: 'Jane Smith', email: 'jane@demo.com', role: 'Member', status: 'Accepted', contact: '9123456780' },
      { user_id: 3, name: 'Mike Ross', email: 'mike@demo.com', role: 'Member', status: 'Rejected', contact: '9988776655' }
    ]
  },
  {
    workspace_id: 2,
    users: [
      { user_id: 2, name: 'Jane Smith', email: 'jane@demo.com', role: 'Admin', status: 'Accepted', contact: '9123456780' },
      { user_id: 4, name: 'Rachel Green', email: 'rachel@demo.com', role: 'Member', status: 'Accepted', contact: '9001122334' },
      { user_id: 5, name: 'Ross Geller', email: 'ross@demo.com', role: 'Member', status: 'Rejected', contact: '9112233445' }
    ]
  },
  {
    workspace_id: 3,
    users: [
      { user_id: 3, name: 'Mike Ross', email: 'mike@demo.com', role: 'Admin', status: 'Invited', contact: '9988776655' },
      { user_id: 6, name: 'Monica Geller', email: 'monica@demo.com', role: 'Member', status: 'Rejected', contact: '9223344556' },
      { user_id: 7, name: 'Chandler Bing', email: 'chandler@demo.com', role: 'Member', status: 'Accepted', contact: '9334455667' }
    ]
  },
  {
    workspace_id: 4,
    users: [
      { user_id: 1, name: 'John Doe', email: 'john@demo.com', role: 'Admin', status: 'Rejected', contact: '9876543210' },
      { user_id: 8, name: 'Phoebe Buffay', email: 'phoebe@demo.com', role: 'Member', status: 'Rejected', contact: '9445566778' }
    ]
  },
  {
    workspace_id: 5,
    users: [
      { user_id: 2, name: 'Jane Smith', email: 'jane@demo.com', role: 'Admin', status: 'Accepted', contact: '9123456780' },
      { user_id: 9, name: 'Joey Tribbiani', email: 'joey@demo.com', role: 'Member', status: 'Accepted', contact: '9556677889' }
    ]
  },
  {
    workspace_id: 6,
    users: [
      { user_id: 3, name: 'Mike Ross', email: 'mike@demo.com', role: 'Admin', status: 'Invited', contact: '9988776655' },
      { user_id: 10, name: 'Harvey Specter', email: 'harvey@demo.com', role: 'Member', status: 'Accepted', contact: '9667788990' }
    ]
  },
  {
    workspace_id: 7,
    users: [
      { user_id: 4, name: 'Rachel Green', email: 'rachel@demo.com', role: 'Admin', status: 'Invited', contact: '9001122334' },
      { user_id: 11, name: 'Jessica Pearson', email: 'jessica@demo.com', role: 'Member', status: 'Rejected', contact: '9778899001' }
    ]
  },
  {
    workspace_id: 8,
    users: [
      { user_id: 5, name: 'Ross Geller', email: 'ross@demo.com', role: 'Admin', status: 'Invited', contact: '9112233445' },
      { user_id: 12, name: 'Louis Litt', email: 'louis@demo.com', role: 'Member', status: 'Accepted', contact: '9889900112' },
      { user_id: 13, name: 'Louis Litt', email: 'louis@demo.com', role: 'Member', status: 'Accepted', contact: '9889900112' },
      { user_id: 14, name: 'Louis Litt', email: 'louis@demo.com', role: 'Member', status: 'Accepted', contact: '9889900112' },
      { user_id: 15, name: 'Louis Litt', email: 'louis@demo.com', role: 'Member', status: 'Accepted', contact: '9889900112' },
      { user_id: 16, name: 'Louis Litt', email: 'louis@demo.com', role: 'Member', status: 'Accepted', contact: '9889900112' },
      { user_id: 17, name: 'Louis Litt', email: 'louis@demo.com', role: 'Member', status: 'Accepted', contact: '9889900112' },
      { user_id: 18, name: 'Louis Litt', email: 'louis@demo.com', role: 'Member', status: 'Accepted', contact: '9889900112' },
      { user_id: 19, name: 'Louis Litt', email: 'louis@demo.com', role: 'Member', status: 'Accepted', contact: '9889900112' },
      { user_id: 20, name: 'Louis Litt', email: 'louis@demo.com', role: 'Member', status: 'Accepted', contact: '9889900112' },
    ]
  }
];

export const GROUPS = [
  {
    name: 'Design Team',
    members: 8,
    type: 'Workspace',
    invitedBy: 'John',
    status: 'Pending'
  },
  {
    name: 'Marketing Squad',
    type: 'Workspace',
    members: 12,
    invitedBy: 'Alice',
    status: 'Accepted'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
  {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
   {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
   {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
   {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
   {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
   {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  },
   {
    name: 'Dev Core',
    type: 'Workspace',
    members: 5,
    invitedBy: 'Mike',
    status: 'Rejected'
  }

];