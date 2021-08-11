package build

import (
	"os"
	"testing"

	copy "github.com/otiai10/copy"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestRunGoBuild(t *testing.T) {
	tmp, err := os.MkdirTemp("", "test")
	require.NoError(t, err, "Failed to create tmp dir")
	defer os.RemoveAll(tmp)

	// Copy goTestProject from testdata to tmp directory
	err = copy.Copy("testdata/goTestProject", tmp)

	artifactPaths, err := Run(tmp, "valist.yml")
	assert.NoError(t, err, "build.Run() executes with no errors")

	for _, artifact := range artifactPaths {
		assert.FileExists(t, artifact)
	}
}

func TestRunNpmBuild(t *testing.T) {
	tmp, err := os.MkdirTemp("", "test")
	require.NoError(t, err, "Failed to create tmp dir")
	defer os.RemoveAll(tmp)

	// Copy npmTestProject from testdata to tmp directory
	err = copy.Copy("testdata/npmTestProject", tmp)
	artifactPaths, err := Run(tmp, "valist.yml")
	assert.NoError(t, err, "build.Run() executes with no errors")

	for _, artifact := range artifactPaths {
		assert.FileExists(t, artifact)
	}
}
