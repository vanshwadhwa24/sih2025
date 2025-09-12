// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title IdentityRegistry 
/// @notice Stores tamper-proof identity hashes (only hashes on-chain). 
///         Writes are restricted to the contract owner (your backend/admin wallet).
contract IdentityRegistry {
    struct Record {
        bytes32 identityHash; // keccak256 hash of canonicalized identity data
        uint256 timestamp;    // block timestamp when stored
        address registrar;    // the address that registered/updated this record
    }

    /// userKey => Record
    /// userKey can be a UUID, DB id, or a hashed identifier (avoid putting raw Aadhaar as key)
    mapping(bytes32 => Record) private records;

    address public owner;

    event IdentityRegistered(bytes32 indexed userKey, bytes32 indexed identityHash, uint256 timestamp, address registrar);
    event IdentityUpdated(bytes32 indexed userKey, bytes32 indexed oldHash, bytes32 indexed newHash, uint256 timestamp, address registrar);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "IdentityRegistry: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), owner);
    }

    /// @notice Register a new identity hash or overwrite if exists (owner only)
    /// @param userKey A bytes32 key representing the user (e.g., keccak256 of user UUID)
    /// @param identityHash keccak256 hash of canonicalized identity data
    function registerIdentity(bytes32 userKey, bytes32 identityHash) external onlyOwner {
        Record storage r = records[userKey];
        // if there's an existing record, this acts like an update but emits Register event
        r.identityHash = identityHash;
        r.timestamp = block.timestamp;
        r.registrar = msg.sender;

        emit IdentityRegistered(userKey, identityHash, block.timestamp, msg.sender);
    }

    /// @notice Update an existing identity hash (owner only). Emits IdentityUpdated.
    /// @param userKey user identifier
    /// @param newHash new keccak256 hash after update
    function updateIdentity(bytes32 userKey, bytes32 newHash) external onlyOwner {
        Record storage r = records[userKey];
        bytes32 old = r.identityHash;
        r.identityHash = newHash;
        r.timestamp = block.timestamp;
        r.registrar = msg.sender;

        emit IdentityUpdated(userKey, old, newHash, block.timestamp, msg.sender);
    }

    /// @notice Verify given hash against on-chain stored hash
    /// @param userKey user identifier
    /// @param identityHash keccak256 hash of identity data to verify
    /// @return matches true if equal
    function verifyIdentity(bytes32 userKey, bytes32 identityHash) external view returns (bool matches) {
        return records[userKey].identityHash == identityHash;
    }

    /// @notice Read record metadata (hash, ts, registrar)
    /// @param userKey user identifier
    /// @return identityHash stored hash
    /// @return timestamp when stored
    /// @return registrar address that stored/updated
    function getRecord(bytes32 userKey) external view returns (bytes32 identityHash, uint256 timestamp, address registrar) {
        Record storage r = records[userKey];
        return (r.identityHash, r.timestamp, r.registrar);
    }

    /// @notice Transfer ownership (useful for migrating admin key)
    /// @param newOwner new owner address
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "IdentityRegistry: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
