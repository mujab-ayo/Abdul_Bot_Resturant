const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");

function getMainMenu() {
  return `
        Welcome to Abdul_Bot_Resturant! Here is our main menu:

        Please select an option:

        1. Place an order
        99. Checkout order
        98. Order history
        97. Current order
        0. Cancel order
    
    `.trim();
}

async function getMenuItems() {
  const menuItems = await MenuItem.find({ isAvailable: true });

  let mainDish = [];
  let side = [];
  let drink = [];

  menuItems.forEach((item, index) => {
    if (item.category === "Main Dish") {
      mainDish.push(`${item.menuIndex}. ${item.name} - ₦${item.price}`);
    }

    if (item.category === "Side") {
      side.push(`${item.menuIndex}. ${item.name} - ₦${item.price}`);
    }

    if (item.category === "Drink") {
      drink.push(`${item.menuIndex}. ${item.name} - ₦${item.price}`);
    }
  });

  return `
        Main Dish:
            ${mainDish.sort().join("\n")}
        
        Side Dish:
            ${side.sort().join("\n")}

        Drink:
            ${drink.sort().join("\n")}
     `;
}

async function processInputedNumber(inputNumber, session) {
  const input = inputNumber.trim();

  if (session.currentState === "MAIN_MENU") {
    switch (input) {
      case "1":
        session.currentState = "BROWSING_MENU";
        await session.save();
        return await getMenuItems();

      case "99":
        const pendingOrders = await Order.findOne({
          sessionId: session._id,
          status: "PENDING",
        }).populate("items.itemId");

        if (!pendingOrders || pendingOrders.items.length === 0) {
          return `You have no pending orders to checkout. ${getMainMenu()}`;
        }

        const total = pendingOrders.items.reduce((sum, item) => {
          return sum + item.itemId.price * item.quantity;
        }, 0);

        pendingOrders.totalPrice = total;
        pendingOrders.status = "PLACED";
        await pendingOrders.save();

        const reciept = pendingOrders.items
          .map(
            (item) =>
              `${item.quantity}x ${item.itemId.name} - ₦${item.itemId.price * item.quantity}`,
          )
          .join("\n");

        return `Your order has been placed successfully! \n\n
            
            ${reciept} \nTotal: ₦${total} \n\n
            
            Thank you for ordering with Abdul_Bot_Resturant.\n\n\n ${getMainMenu()}`;

        break;

      case "98":
        const orderHistory = await Order.find({
          sessionId: session._id,
          status: { $in: ["PAID", "PLACED"] },
        }).populate("items.itemId");

        if (!orderHistory || orderHistory.length === 0) {
          return `No Order History Found \n\n\n  ${getMainMenu()}`;
        }

        const history = orderHistory
          .map((order, i) => {
            const items = order.items
              .map(
                (item) => `
                    ${item.quantity}X  ${item.itemId.name}
                    `,
              )
              .join("\n");

            return `
                Order   ${i + 1}: 
                        ${items}
                total   ${order.totalPrice}
                status: ${order.status}
                `;
          })
          .join("\n\n");

        return `Order History: \n\n ${history}\n\n\n  ${getMainMenu()}`;

        break;

      case "97":
        const currentOrder = await Order.findOne({
          sessionId: session._id,
          status: "PENDING",
        }).populate("items.itemId");

        if (!currentOrder || currentOrder.items.length === 0) {
          return `You have no current order. \n\n\n  ${getMainMenu()}`;
        }

        const items = currentOrder.items
          .map(
            (item) =>
              `${item.quantity}x ${item.itemId.name} - ₦${item.itemId.price * item.quantity}`,
          )
          .join("\n");

        return `Current Order:\n\n${items}\n\nTotal so far: ₦${currentOrder.totalPrice}\n\n\n ${getMainMenu()}`;
        break;

      case "0":
        const orderToCancel = await Order.findOne({
          sessionId: session._id,
          status: "PENDING",
        });

        if (!orderToCancel)
          return `No order to cancel.\n\n\n  ${getMainMenu()}`;

        orderToCancel.status = "CANCELLED";
        await orderToCancel.save();
        return ` Order cancelled.\n\n\n  ${getMainMenu()}`;

        break;

      default:
        return getMainMenu();
    }
  } else if (session.currentState === "BROWSING_MENU") {
    if (input === "0") {
      session.currentState = "MAIN_MENU";
      await session.save();
      return getMainMenu();
    }

    const menuIndex = parseInt(input);
    if (isNaN(menuIndex)) {
      return `Invalid input. Please enter a number.\n\n  ${await getMenuItems()}`;
    }

    const menuItem = await MenuItem.findOne({
      menuIndex,
      isAvailable: true,
    });
    if (!menuItem) {
      return `Item not found. Please select a valid number.\n\n 
        ${await getMenuItems()}`;
    }

    let order = await Order.findOne({
      sessionId: session._id,
      status: "PENDING",
    });

    if (order) {
      order.items.push({ itemId: menuItem._id, quantity: 1 });
      await order.save();
    } else {
      order = await Order.create({
        sessionId: session._id,
        items: [{ itemId: menuItem._id, quantity: 1 }],
      });
    }

    return `${menuItem.name} added to your order!\n\nType another number to add more items.\nType 0 to go back to main menu.`;
  }
}

module.exports = { processInputedNumber };
