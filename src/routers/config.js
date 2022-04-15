/*
 * @Author: fangt11
 * @Date:   2021-07-05 16:14:26
 * @Last Modified by:   shuoshubao
 * @Last Modified time: 2022-04-15 16:43:01
 * @Desc: 路由配置
 */

import React from 'react'
import GitlabOutlined from '@ant-design/icons/GitlabOutlined'
import PictureOutlined from '@ant-design/icons/PictureOutlined'
import AntDesignOutlined from '@ant-design/icons/AntDesignOutlined'
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined'
import ChromeOutlined from '@ant-design/icons/ChromeOutlined'
import { NodeJs as NodeIcon } from '@/assets/icons'
import Index, { NoMatch } from '@/views/Index'
import NodeJs from '@/views/NodeJs'
import Git from '@/views/Git'
import Tinify from '@/views/Tinify'
import AntDesignColors from '@/views/AntDesign/Colors'
import Apps from '@/views/Apps'
import Browser from '@/views/Browser'

export default [
  {
    name: 'Node 管理',
    icon: <NodeIcon />,
    path: '/nodejs',
    component: NodeJs
  },
  {
    name: 'Git 管理',
    icon: <GitlabOutlined />,
    path: '/git',
    component: Git
  },
  {
    name: 'App Store',
    icon: <AppstoreOutlined />,
    path: '/apps',
    component: Apps
  },
  {
    name: 'Chrome 插件',
    icon: <ChromeOutlined />,
    path: '/browser',
    component: Browser
  },
  {
    name: '图片压缩',
    icon: <PictureOutlined />,
    path: '/tinify',
    component: Tinify
  },
  {
    name: 'Ant Design',
    icon: <AntDesignOutlined />,
    children: [
      {
        name: 'Colors',
        path: '/ant-design/colors',
        component: AntDesignColors
      }
    ]
  },
  {
    path: '/',
    component: Index,
    exact: true
  },
  // 404
  {
    path: '*',
    component: NoMatch
  }
]
