import { beforeEach, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'vitest-mock-extended'

// mock mora biti TOP-LEVEL
vi.mock('../src/db', () => ({
  prisma: mockDeep<PrismaClient>(),
}))

// statički import – nema require
import { prisma } from '../src/db'

beforeEach(() => {
  mockReset(prisma)
})
