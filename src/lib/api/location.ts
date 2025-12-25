import { Province, Ward } from "./types"
export async function getProvinces(): Promise<Province[]> {
  try {
    const res = await fetch("https://provinces.open-api.vn/api/v2/p/")
    if (!res.ok) throw new Error("Lỗi load tỉnh thành")
    return await res.json()
  } catch {
    return [] // fallback
  }
}

export async function getWardsByProvince(provinceCode: number): Promise<Ward[]> {
  try {
    const res = await fetch(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`)
    if (!res.ok) throw new Error("Lỗi load phường/xã")
    const data = await res.json()
    return data.wards || [] 
  } catch {
    return []
  }
}