import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Avatar } from '@material-ui/core'
import ProviderIcon from '@material-ui/icons/Public'
import ProvisionIcon from '@material-ui/icons/Cloud'

import SelectCard from 'client/components/Cards/SelectCard'
import Action from 'client/components/Cards/SelectCard/Action'
import { IMAGES_URL } from 'client/constants'

const ProvisionCard = memo(
  ({ value, isSelected, handleClick, isProvider, imgAsAvatar, actions }) => {
    const DEFAULT_IMAGE = isProvider ? 'provider.webp' : 'provision.webp'

    const [image, setImage] = useState(undefined)
    const { ID, NAME, TEMPLATE: { PLAIN = '{}' } } = value

    useEffect(() => {
      try {
        const plain = JSON.parse(PLAIN)
        setImage(plain?.image ?? DEFAULT_IMAGE)
      } catch {
        setImage(DEFAULT_IMAGE)
        console.warn('Image in plain property is not valid')
      }
    }, [])

    const isExternalURL = RegExp(/^(http|https):/g).test(image)

    const onError = evt => {
      evt.target.src = `${IMAGES_URL}/${DEFAULT_IMAGE}`
    }

    return (
      <SelectCard
        title={`${ID} - ${NAME}`}
        isSelected={isSelected}
        handleClick={handleClick}
        action={actions?.map(action => <Action key={action?.cy} {...action} />)}
        icon={isProvider ? <ProviderIcon /> : <ProvisionIcon />}
        {...(imgAsAvatar
          ? {
            icon: image && (
              <Avatar
                src={isExternalURL ? image : `${IMAGES_URL}/${image}`}
                variant="rounded"
                style={{ width: 100, height: 80 }}
                imgProps={{ onError }}
              />
            )
          }
          : { mediaProps: { component: 'img', image, onError } }
        )}
      />
    )
  }, (prev, next) => prev.isSelected === next.isSelected
)

ProvisionCard.propTypes = {
  value: PropTypes.shape({
    ID: PropTypes.string.isRequired,
    NAME: PropTypes.string.isRequired,
    TEMPLATE: PropTypes.shape({
      PLAIN: PropTypes.string,
      PROVISION_BODY: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ])
    })
  }),
  isSelected: PropTypes.bool,
  handleClick: PropTypes.func,
  isProvider: PropTypes.bool,
  imgAsAvatar: PropTypes.bool,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      handleClick: PropTypes.func.isRequired,
      icon: PropTypes.object.isRequired,
      cy: PropTypes.string
    })
  )
}

ProvisionCard.defaultProps = {
  value: {},
  isSelected: undefined,
  handleClick: undefined,
  isProvider: false,
  imgAsAvatar: false,
  actions: undefined
}

ProvisionCard.displayName = 'ProvisionCard'

export default ProvisionCard