-- CreateTable
CREATE TABLE "BuyTriggeredEvent" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuyTriggeredEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BuyTriggeredEvent" ADD CONSTRAINT "BuyTriggeredEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
