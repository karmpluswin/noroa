import { integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { resource } from "./resource";
import { timestamps } from "./_shared";

export const savedResource = pgTable(
  "saved_resource",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    resourceId: uuid("resource_id")
      .notNull()
      .references(() => resource.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [uniqueIndex("saved_user_resource_idx").on(t.userId, t.resourceId)],
);

export const collection = pgTable("collection", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  ...timestamps,
});

export const collectionItem = pgTable(
  "collection_item",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
    resourceId: uuid("resource_id")
      .notNull()
      .references(() => resource.id, { onDelete: "cascade" }),
    orderIndex: integer("order_index").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("collection_item_idx").on(t.collectionId, t.resourceId)],
);

export const collectionRelations = relations(collection, ({ many }) => ({
  items: many(collectionItem),
}));

export const collectionItemRelations = relations(collectionItem, ({ one }) => ({
  collection: one(collection, { fields: [collectionItem.collectionId], references: [collection.id] }),
  resource: one(resource, { fields: [collectionItem.resourceId], references: [resource.id] }),
}));