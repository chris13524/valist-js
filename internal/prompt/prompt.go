package prompt

import (
	"errors"
	"fmt"
	"os"
	"strconv"

	"github.com/manifoldco/promptui"
	"github.com/urfave/cli/v2"

	"github.com/valist-io/valist/internal/core/types"
)

var ErrNonInteractive = errors.New("prompt in non-interactive environment")

type Prompt struct {
	inner promptui.Prompt
}

// Run returns the value of the prompt. If a CI environment is detected ErrNonInteractive is returned.
func (p Prompt) Run() (string, error) {
	if ci, _ := strconv.ParseBool(os.Getenv("CI")); ci {
		return "", ErrNonInteractive
	}

	return p.inner.Run()
}

// RunFlag returns the value of the flag if set, otherwise the prompt is run normally.
func (p Prompt) RunFlag(c *cli.Context, flag string) (string, error) {
	if c.IsSet(flag) {
		return c.String(flag), nil
	}

	return p.Run()
}

func NewAccountPassphrase() Prompt {
	return Prompt{promptui.Prompt{
		Label:       "New account passphrase",
		Mask:        '*',
		HideEntered: true,
		Validate:    ValidateMinLength(5),
	}}
}

func AccountPrivateKey() Prompt {
	return Prompt{promptui.Prompt{
		Label:       "Hex-encoded ECDSA private key",
		Mask:        '*',
		HideEntered: true,
		Validate:    ValidateMinLength(32),
	}}
}

func AccountPassphrase() Prompt {
	return Prompt{promptui.Prompt{
		Label:       "Account passphrase",
		Mask:        '*',
		HideEntered: true,
		Validate:    ValidateMinLength(5),
	}}
}

func OrganizationName(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label:    "Organization name or username",
		Default:  value,
		Validate: ValidateMinLength(1),
	}}
}

func OrganizationDescription(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label:    "Organization description",
		Default:  value,
		Validate: ValidateMinLength(1),
	}}
}

func OrganizationHomepage(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label:   "Organization homepage",
		Default: value,
	}}
}

func RepositoryName(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label:    "Repository name",
		Default:  value,
		Validate: ValidateMinLength(1),
	}}
}

func RepositoryDescription(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label:    "Repository description",
		Default:  value,
		Validate: ValidateMinLength(1),
	}}
}

func RepositoryProjectType() *promptui.Select {
	return &promptui.Select{
		Label: "Repository project type",
		Items: types.ProjectTypes,
	}
}

func RepositoryHomepage(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label:   "Repository homepage",
		Default: value,
	}}
}

func RepositoryURL(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label:   "Repository url",
		Default: value,
	}}
}

func ReleaseTag(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label:   "Latest release tag",
		Default: value,
	}}
}

func ReleaseMetaPath() Prompt {
	return Prompt{promptui.Prompt{
		Label: "Path to metadata file (README.md)",
	}}
}

func InstallCommand(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label:   "Command used to install dependencies",
		Default: value,
	}}
}

func BuildCommand(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label:   "Command used to build your project",
		Default: value,
	}}
}

func DockerImage(value string) Prompt {
	return Prompt{promptui.Prompt{
		Label: fmt.Sprintf("Docker image (if not set, will default to %v)", value),
	}}
}

func BuildOutPath() Prompt {
	return Prompt{promptui.Prompt{
		Label: "Build output file/directory",
	}}
}

func BuildPlatforms() Prompt {
	return Prompt{promptui.Prompt{
		Label:     "Are you building for multiple architecures? (y,N)",
		IsConfirm: true,
		Validate:  ValidateYesNo(),
	}}
}

func BuildOS() Prompt {
	return Prompt{promptui.Prompt{
		Label: "Platform operating system, e.g. linux, darwin, freebsd, windows (leave blank to quit)",
	}}
}

func BuildArch() Prompt {
	return Prompt{promptui.Prompt{
		Label: "Platform architecture, e.g. amd64, arm64",
	}}
}

func BuildArtifactPath() Prompt {
	return Prompt{promptui.Prompt{
		Label: "Artifact file path",
	}}
}
