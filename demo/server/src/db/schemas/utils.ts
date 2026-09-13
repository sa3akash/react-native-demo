import { createId } from "@paralleldrive/cuid2";
import { timestamp, varchar } from "drizzle-orm/pg-core";

export const Id = varchar("id")
    .$defaultFn(() => createId())
    .primaryKey();


export const defaultColumns = {
    id: Id,
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
};

