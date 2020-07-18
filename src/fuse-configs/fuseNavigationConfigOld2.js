export const fuseNavigationConfig = [
  {
    id: 'applications',
    title: 'Applications',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'example-component',
        title: 'Example',
        type: 'item',
        icon: 'whatshot',
        url: '/example',
      },

      {
        id: 'hr',
        title: 'HR',
        type: 'collapse',
        icon: 'group',
        children: [

          {
            id: 'company',
            title: 'Company',
            type: 'item',
            // 'icon'    : 'list',
            url: '/hr/company/company',
          },
          {
            id: 'travelManagement',
            title: 'Travel Management',
            type: 'collapse',
            // 'icon'    : 'list',
            // 'url': '/hr/travelRequest'
            children: [
              {
                id: 'travelRequest',
                title: 'Travel Request',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/travelManagement/travelRequest',
              },
              {
                id: 'subordinateTravelRequest',
                title: 'Subordinate Travel Request',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/travelManagement/subordinateTravelRequest',
              },
            ],
          },
          {
            id: 'announcement',
            title: 'Announcement',
            type: 'item',
            // 'icon'    : 'list',
            url: '/hr/announcement',
          },
          {
            id: 'hrcalendar',
            title: 'HR Calendar',
            type: 'item',
            // 'icon'    : 'list',
            url: '/hr/calendar',
          },
          {
            id: 'assetManagement',
            title: 'Asset Management',
            type: 'collapse',
            // 'icon'    : 'list',
            // 'url': '/hr/assetManagement'
            children: [
              {
                id: 'assetList',
                title: 'Asset List',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/assetManagement/assetList',
              },
              {
                id: 'employeeAssetList',
                title: 'Employee Asset List',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/assetManagement/employeeAssetList',
              },
            ],
          },
          {
            id: 'salary',
            title: 'Salary',
            type: 'collapse',
            // 'icon'    : 'list',
            // 'url': '/hr/salary'
            children: [
              {
                id: 'stopSalary',
                title: 'Stop Salary',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/salary/stopSalary',
              },
              {
                id: 'incrementSalary',
                title: 'Salary Increment',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/salary/incrementSalary',
              },
              {
                id: 'salary-advance',
                title: 'Salary Advance',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/salary/salaryAdvance',
              },
            ],
          },

          {
            id: 'leave',
            title: 'Leave',
            type: 'collapse',
            // 'icon'    : 'list',
            children: [
              {
                id: 'requestedLeaveList',
                title: 'Requested Leave List',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/leave/requestedLeaveList',
              },

            ],
          },


          {
            id: 'attendance',
            title: 'Attendance',
            type: 'collapse',
            // 'icon'    : 'list',
            children: [
              {
                id: 'lateAttendance',
                title: 'Late Attendance',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/attendance/lateAttendance',
              },
              {
                id: 'attendance',
                title: 'Attendance',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/attendance/attendance',
              },
              {
                id: 'monthlyAttendance',
                title: 'Monthly Attendance',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/MonthlyAttendance',
              },

              {
                id: 'ot-view',
                title: 'OT View',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/attendance/otView',
              },
            ],
          },

          {
            id: 'employee',
            title: 'Employee',
            type: 'collapse',
            // 'icon'    : 'list',
            children: [
              {
                id: 'newEmployee',
                title: 'New Employee',
                type: 'item',
                // 'icon'    : 'playlist_add',
                url: 'hr/employee/newEmployee',
              },
              {
                id: 'employeeView',
                title: 'Employee View',
                type: 'item',
                // 'icon'    : 'playlist_add',
                url: 'hr/employee/employeeView',
              },
              {
                id: 'finalStatement',
                title: 'Final Statement',
                type: 'item',
                // 'icon'    : 'playlist_add',
                url: 'hr/employee/finalStatement',
              },
            ],
          },

          {
            id: 'leave-user',
            title: 'Leave',
            type: 'collapse',
            // 'icon'    : 'list',
            // 'url': '/hr/leaveUser'
            children: [
              {
                id: 'my-leave',
                title: 'My Leave',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/leave-user/myLeave',
              },
              {
                id: 'leave-list',
                title: 'Leave List',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/leave-user/leaveList',
              },
              {
                id: 'team-leave-list',
                title: 'Team Leave List',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/leave-user/teamLeaveList',
              },

            ],
          },

          {
            id: 'group',
            title: 'Group',
            type: 'collapse',
            // 'icon'    : 'list',
            // 'url': '/hr/group',
            children: [
              {
                id: 'group-view',
                title: 'Group View',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/group/groupView',
              },
              {
                id: 'group-creation',
                title: 'Group Creation',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/group/groupCreation',
              },
            ],
          }, {
            id: 'loan',
            title: 'Loan',
            type: 'collapse',
            // 'icon'    : 'list',
            // 'url': '/hr/group',
            children: [
              // {
              //     'id': 'loan-calculator',
              //     'title': 'Loan Calculator',
              //     'type': 'item',
              //     // 'icon'    : 'list',
              //     'url': '/hr/loan/loanCalculator'
              // },
              // {
              //     'id': 'loan-details',
              //     'title': 'Loan Details',
              //     'type': 'item',
              //     // 'icon'    : 'list',
              //     'url': '/hr/loan/loanDetails'
              // },
              // {
              //     'id': 'create-loan',
              //     'title': 'Create Loan',
              //     'type': 'item',
              //     // 'icon'    : 'list',
              //     'url': '/hr/loan/createLoan'
              // },
              {
                id: 'loan-request',
                title: 'Loan Request',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/loan/loanRequest',
              },
              {
                id: 'loan-settlement',
                title: 'Loan Settlement',
                type: 'item',
                // 'icon'    : 'list',
                url: '/hr/loan/loanSettlement',
              },
              // {
              //     'id': 'loan-history',
              //     'title': 'Loan History',
              //     'type': 'item',
              //     // 'icon'    : 'list',
              //     'url': '/hr/loan/loanHistory'
              // },
              {
                id: 'loanType',
                title: 'Loan Type',
                type: 'item',
                url: '/hr/loan/loanType',
              },
              {
                id: 'loanInspection',
                title: 'Loan Inspection',
                type: 'item',
                url: '/hr/loan/loanInspection',
              },
              {
                id: 'loanList',
                title: 'Loan List',
                type: 'item',
                url: '/hr/loan/LoanList',
              },
              {
                id: 'loanPayment',
                title: 'Loan Payment',
                type: 'item',
                url: '/hr/loan/LoanPayment',
              },
            ],
          },
          {
            id: 'leave',
            title: 'Leave Management',
            type: 'collapse',
            children: [
              {
                id: 'LeaveType',
                title: 'Leave Type',
                type: 'item',
                url: '/hr/leave/LeaveType',
              },
              {
                id: 'LeaveEntitlement',
                title: 'Leave Entitlement',
                type: 'item',
                url: '/hr/leave/LeaveEntitlement',
              },
            ],
          },
          {
            id: 'shift',
            title: 'Shift',
            type: 'collapse',
            children: [
              {
                id: 'shiftMaster',
                title: 'Shift Master',
                type: 'item',
                url: '/hr/shift/shiftMaster',
              },
              {
                id: 'timeAllocation',
                title: 'Time Allocation',
                type: 'item',
                url: '/hr/shift/timeAllocation',
              },
            ],
          },
          {
            id: 'metaData',
            title: 'Meta Data',
            type: 'item',
            // 'icon'    : 'list',
            url: '/hr/metaData/metaData',
          },
          {
            id: 'masterData',
            title: 'Master Data',
            type: 'item',
            // 'icon'    : 'list',
            url: '/hr/masterData/masterData',
          },
        ],
      },
      {
        id: 'employee',
        title: 'Employee',
        type: 'collapse',
        icon: 'group',
        children: [
          {
            id: 'view-Employee',
            title: 'View Employee',
            type: 'item',
            // 'icon'    : 'playlist_add',
            url: '/employee/ViewEmployee',
          },

        ],
      },
    ],
  },
];
