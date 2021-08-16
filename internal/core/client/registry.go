package client

import (
	"bytes"
	"context"
	"fmt"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"

	"github.com/valist-io/registry/internal/contract/registry"
	"github.com/valist-io/registry/internal/core"
)

// GetOrganizationID returns the ID of the organization with the given name.
func (client *Client) GetOrganizationID(ctx context.Context, name string) (common.Hash, error) {
	if orgID, ok := client.orgs[name]; ok {
		return orgID, nil
	}

	callopts := bind.CallOpts{
		Context: ctx,
		From:    client.account.Address,
	}

	orgID, err := client.registry.NameToID(&callopts, name)
	if err != nil {
		return emptyHash, fmt.Errorf("Failed to get organization id: %v", err)
	}

	if bytes.Equal(orgID[:], emptyHash.Bytes()) {
		return emptyHash, core.ErrOrganizationNotExist
	}

	client.orgs[name] = orgID
	return orgID, nil
}

// LinkOrganizationName creates a link from the given orgID to the given name.
func (client *Client) LinkOrganizationName(
	ctx context.Context,
	txopts *bind.TransactOpts,
	orgID common.Hash,
	name string,
) (*registry.ValistRegistryMappingEvent, error) {

	tx, err := client.transactor.LinkOrganizationNameTx(ctx, txopts, orgID, name)
	if err != nil {
		return nil, err
	}

	logs, err := waitMined(ctx, client.eth, tx)
	if err != nil {
		return nil, err
	}

	return client.registry.ParseMappingEvent(*logs[0])
}
