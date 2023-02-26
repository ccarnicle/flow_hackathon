 export const setupAccount = 
`
// REPLACE THIS WITH YOUR CONTRACT NAME + ADDRESS
import aiSportsMinter from 0xc03bdc0fd49acfed 

// Do not change these
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

/// This transaction is what an account would run
/// to set itself up to receive NFTs
transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&aiSportsMinter.Collection>(from: aiSportsMinter.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- aiSportsMinter.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: aiSportsMinter.CollectionStoragePath)

        // create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, aiSportsMinter.aiSportsMinterCollectionPublic, MetadataViews.ResolverCollection}>(
            aiSportsMinter.CollectionPublicPath,
            target: aiSportsMinter.CollectionStoragePath
        )
    }
}
`