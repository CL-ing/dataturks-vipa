/*
 * @Author: Azhou
 * @Date: 2021-05-11 10:47:01
 * @LastEditors: Azhou
 * @LastEditTime: 2021-06-16 22:08:20
 */
import {
  CreateDataSet,
  CreateProject,
  EntryPage,
  LoginAndSignUp,
  MyProjects,
  TryDemo,
  UserHome,
  ProjectOverview,
  TaggerSpace,
  TaggerSpaceNew,
  TaggerCreate,
  TaggerImport,
  TaggerStats,
  TaggerExport,
  TaggerProjects,
  TaggerAdd,
  TaggerOveriew,
  TaggerVisualize,
  TaggerEdit,
  TaggerOrg,
  TaggerOrgProject,
  TaggerError,
  TaggerKeyBind,
  TaggerContributors,
} from '../pages'

const routes = [
  {
    path: '/entryPage',
    component: EntryPage,
  },
  {
    path: '/login',
    component: LoginAndSignUp,
  },
  {
    path: '/try-demo',
    component: TryDemo,
  },
  {
    path: '/userHome',
    component: UserHome,

    routes: [
      {
        path: '/userHome/my-projects',
        component: MyProjects,
      },
      {
        path: '/userHome/create-dataset',
        component: CreateDataSet,
      },
      {
        path: '/userHome/import',
        component: CreateProject,
      },
      { path: '/userHome/projects/overview', component: ProjectOverview },
      { path: '/userHome/projects/:orgName/:projectName', exact: true, component: ProjectOverview },
      { path: '/userHome/projects/:orgName/:projectName/export', component: TaggerExport },
      {
        path: '/userHome/projects/:orgName/:projectName/visualize',
        exact: true,
        component: TaggerVisualize,
      },

      { path: '/userHome/projects/:orgName', exact: true, component: MyProjects },
      // 部分需要登录才能使用的路由（暂时没做登录校验）
      // {path: "/projects/create", component: TaggerCreate},
      { path: '/userHome/projects/edit', exact: true, component: TaggerEdit },
      // {path: "/projects/:orgName/create", component: TaggerCreate},
      // {path: "/projects/:orgName/import", component: TaggerImport},
      {
        path: '/userHome/projects/:orgName/:projectName/edit/:type',
        exact: true,
        component: TaggerEdit,
      },
      { path: '/userHome/projects/:orgName/:projectName/keybind', component: TaggerKeyBind },

      // {path: "/projects/import", component: TaggerImport},
      // {path: "/projects/space", component: TaggerSpace},
      // {path: "/projects/stats", component: TaggerStats},

      // {path: "/projects/add", component: TaggerAdd},
      { path: '/userHome/projects/visualize', exact: true, component: TaggerVisualize },

      // {path: "/projects/errors", component: TaggerError},
      // {path: "/projects/:orgName/:projectName/contributors", component: TaggerContributors},
    ],
  },
  {
    path: '/projects/:orgName/:projectName/space',
    exact: true,
    component: TaggerSpace,
  },
  {
    path: '/projects/new/:orgName/:projectName/space',
    exact: true,
    component: TaggerSpaceNew,
  },
]

export default routes
