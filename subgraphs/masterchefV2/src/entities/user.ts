import { User } from "../../generated/schema";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { BIG_INT_ZERO } from "const";
import { getMasterChef } from "./masterChef";
import { getPool } from "./pool";

export function getUser(
  address: Address,
  pid: BigInt,
  block: ethereum.Block
): User {
  const masterChef = getMasterChef(block);
  const pool = getPool(pid, block);

  const uid = address.toHex();
  const id = pid.toString().concat("-").concat(uid);
  let user = User.load(id);

  if (user === null) {
    user = new User(id);
    user.address = address;
    user.pool = pool.id;
    user.amount = BIG_INT_ZERO;
    user.rewardDebt = BIG_INT_ZERO;
    user.beetsHarvested = BIG_INT_ZERO;
  }

  user.timestamp = block.timestamp;
  user.block = block.number;
  user.save();

  return user as User;
}