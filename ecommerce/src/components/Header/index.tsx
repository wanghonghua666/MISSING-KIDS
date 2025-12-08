import { getCachedGlobal } from '@/utilities/getGlobals'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  // 使用 depth: 2 确保获取关联的 media 数据（包括 logo）
  const header = await getCachedGlobal('header', 2)()

  return <HeaderClient header={header} />
}